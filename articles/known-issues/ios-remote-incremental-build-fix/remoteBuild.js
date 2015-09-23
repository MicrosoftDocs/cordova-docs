/********************************************************
*                                                       *
*   Copyright (C) Microsoft. All rights reserved.       *
*                                                       *
********************************************************/
"use strict";

var request = require('request'),
    fs = require('fs'),
    fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib'),
    path = require('path'),
    Q = require('q'),
    AdmZip = require('adm-zip'),
    util = require('./util'),
    rimraf = require('rimraf'),
    res = require('./resources'),
    edge = require('edge');

var getCertificateFunc = edge.func(path.join(__dirname, "getCertificate.cs"));
var remoteBuild = exports = module.exports = {};

var pingInterval = 5000;
var incrementalBuildNumber = 0;

remoteBuild.build = function (settings) {
    var outputBuildDir = settings.platformConfigurationBldDir;
    var outputBinDir = settings.platformConfigurationBinDir;
    var buildInfoFilePath = path.join(outputBuildDir, 'buildInfo.json');
    
    if (remoteBuild.isValidBuildServerUrl(settings.buildServerUrl) === false) {
        throw new Error(res.getString('InvalidRemoteBuildUrl', settings.buildServerUrl));
    }
    
    var promise =
 Q.fcall(function () {
        return initializeForHttpsIfNecessary(settings);
    }).
            then(function () {
        return checkForBuildOnServer(settings, buildInfoFilePath);
    }).
            then(function (canDoIncremental) {
        settings.isIncrementalBuild = canDoIncremental;
        console.info(res.getString('IncrementalBuild', settings.isIncrementalBuild));
        
        var iosJsonFile = path.join(settings.projectSourceDir, 'plugins', 'remote_ios.json');
        if (fs.existsSync(iosJsonFile)) {
            fs.unlinkSync(iosJsonFile);
        }
    }).
            then(function () {
        return appAsTgzStream(settings);
    }).
            then(function (tgz) {
        return submitBuildRequestToServer(settings, tgz);
    }).
            then(function (buildingUrl) {
        return pollForBuildComplete(settings, buildingUrl, pingInterval, 0);
    }).
            then(function (result) {
        if (result.buildNumber) {
            return logBuildOutput(result, settings);
        } else if (result.buildInfo) {
            return logBuildOutput(result.buildInfo, settings).then(function () { return throwErrorAfterDelay(1000, result); });
        }
    }).
            then(function (buildInfo) {
        return downloadRemotePluginFile(buildInfo, settings, path.join(settings.projectSourceDir, 'plugins'));
    }).
            then(function (buildInfo) {
        util.createDirectoryIfNecessary(outputBuildDir);
        fs.writeFileSync(path.join(outputBuildDir, 'buildInfo.json'), JSON.stringify(buildInfo));
        return buildInfo;
    });
    // If build is for a device we will download the build as a zip with an ipa file and plist file in it
    if (isDeviceBuild(settings)) {
        var resultingBuildInfo;
        promise = promise.
            then(function (buildInfo) {
            resultingBuildInfo = buildInfo;
            return downloadBuild(buildInfo, settings, outputBuildDir);
        }).
            then(function (zipFile) {
            return unzipBuildFiles(zipFile, outputBinDir);
        }).
            then(function () {
            return resultingBuildInfo;
        });
    }
    return promise;
};

remoteBuild.isValidBuildServerUrl = function (serverUrl) {
    if (!serverUrl) {
        return false;
    }

    return (serverUrl.indexOf('http://') === 0 || serverUrl.indexOf('https://') === 0);
};

remoteBuild.agent = function (buildServerUrl, certificateName) {
    if (buildServerUrl.indexOf('https://') !== 0) {
        return null;
    }
    
    try {
        var pfxData = getCertificateFunc(certificateName, /* synchronous = */ true);
        var https = require('https');
        return new https.Agent({
            pfx: pfxData,
            rejectUnauthorized: true
        });
    } catch (e) {
        throw new Error(res.getString('RemoteBuildClientCertMissing'));
    }
};

remoteBuild.httpOptions = function (url, settings) {
    return {
        url: url,
        headers: { 'Accept-Language': settings.language },
        agent: settings.agent
    };
};

function checkForBuildOnServer(settings, buildInfoFilePath) {
    var deferred = Q.defer();
    
    if (!fs.existsSync(buildInfoFilePath)) {
        deferred.resolve(false);
        return deferred.promise;
    }
    
    var buildInfo = require(buildInfoFilePath);
    if (!buildInfo) {
        deferred.resolve(false);
        return deferred.promise;
    }
    
    var buildNumber = buildInfo.buildNumber;
    
    var serverUrl = settings.buildServerUrl;
    var buildUrl = serverUrl + '/build/' + buildNumber;
    
    request.get(remoteBuild.httpOptions(buildUrl, settings), function (error, response, body) {
        if (error) {
            deferred.reject(errorFromRemoteBuildServer(serverUrl, error, 'RemoteBuildError'));
        } else if (response.statusCode === 200) {
            incrementalBuildNumber = buildNumber;
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    
    return deferred.promise;
}

function errorFromRemoteBuildServer(serverUrl, requestError, fallbackErrorId) {
    if (requestError.toString().indexOf('CERT_') !== -1) {
        return new Error(res.getString('InvalidRemoteBuildClientCert'));
    } else if (serverUrl.indexOf('https://') === 0 && requestError.code === 'ECONNRESET') {
        return new Error(res.getString('RemoteBuildSslConnectionReset', serverUrl));
    } else if (serverUrl.indexOf('http://') === 0 && requestError.code === 'ECONNRESET') {
        return new Error(res.getString('RemoteBuildNonSslConnectionReset', serverUrl));
    } else if (requestError.code === 'ENOTFOUND') {
        // Host unreachable regardless of whether http or https
        return new Error(res.getString('RemoteBuildHostNotFound', serverUrl));
    } else if (requestError.code === 'ECONNREFUSED') {
        // Host reachable but connection not established (e.g. Server not running)
        return new Error(res.getString('RemoteBuildNoConnection', serverUrl));
    }
    return new Error(res.getString(fallbackErrorId, serverUrl, requestError));
}

function appAsTgzStream(settings) {
    var projectSourceDir = settings.projectSourceDir;
    var _filterForTar = function (reader, props) {
        return filterForTar(settings, reader, props);
    };
    
    if (fs.existsSync(settings.changeListFile)) {
        util.copyFileContentsSync(settings.changeListFile, path.join(projectSourceDir, 'changeList.json'));
    }
    
    if (settings.changeList) {
        preParsePluginsList(settings);
    }
    
    var cordovaAppDirReader = fstream.Reader({ path: projectSourceDir, type: 'Directory', mode: 777, filter: _filterForTar });
    var tgzProducingStream = cordovaAppDirReader.pipe(tar.Pack()).pipe(zlib.createGzip());
    return tgzProducingStream;
}

var resSlashIcons = path.join('res', 'icons');
var resSlashScreens = path.join('res', 'screens');
var resSlashCert = path.join('res', 'cert');

// We will only want to archive up what is needed for an ios build
function filterForTar(settings, reader, props) {
    if (reader.parent !== null) {
        var appRelPath = path.relative(settings.projectSourceDir, reader.path);
        if (appRelPath) {
            if (reader.parent.basename.match(/^merges$/) && appRelPath.indexOf('merges') === 0) {
                if (reader.basename !== 'ios') {
                    return false;
                }
            }
            if (reader.parent.basename.match(/^platforms$/) && appRelPath.indexOf('platforms') === 0) {
                return false;
            }
            if (appRelPath === '.vs' ||
                appRelPath === 'bin' ||
                appRelPath === 'bld') {
                return false;
            }
            if (reader.parent.basename.match(/^icons$/) && appRelPath.indexOf(resSlashIcons) === 0) {
                if (reader.basename !== 'ios') {
                    return false;
                }
            }
            if (reader.parent.basename.match(/^screens$/) && appRelPath.indexOf(resSlashIcons) === 0) {
                if (reader.basename !== 'ios') {
                    return false;
                }
            }
            if (reader.parent.basename.match(/^cert$/) && appRelPath.indexOf(resSlashCert) === 0) {
                if (reader.basename !== 'ios') {
                    return false;
                }
            }
        }
        
        if (util.endsWith(appRelPath, '.jsproj') ||
            util.endsWith(appRelPath, '.jsproj.user') ||
            util.endsWith(appRelPath, '.sln') ||
            appRelPath === 'Project_Readme.html') {
            return false;
        }
    }
    
    if (settings.isIncrementalBuild && settings.changeList && appRelPath) {
        if (appRelPath == 'www') {
            return true;
        }
        
        var stat = fs.statSync(reader.path);
        
        if (stat.isDirectory()) {
            if (appRelPath === 'plugins' &&
                settings.changeList.addedPlugins.length > 0) {
                return true;
            }
            
            if (appRelPath.indexOf('plugins' + path.sep) === 0) {
                var plugin = appRelPath.substr(8);
                
                if (plugin.indexOf(path.sep) > 0) {
                    plugin = plugin.substr(0, plugin.indexOf(path.sep));
                }
                
                for (var i = 0; i < settings.changeList.addedPlugins.length; i++) {
                    var addedPlugin = settings.changeList.addedPlugins[i];
                    if (addedPlugin === plugin ||
                        addedPlugin.indexOf(plugin + '@') === 0) {
                        return true;
                    }
                }
            }
            
            for (var i = 0; i < settings.changeList.changedFilesIos.length; i++) {
                var changedFile = settings.changeList.changedFilesIos[i];
                if (changedFile.indexOf(appRelPath + path.sep) == 0) {
                    return true;
                }
            }
            
            return false;
        }
        
        if (appRelPath === 'changeList.json') {
            return true;
        }
        
        if (appRelPath.indexOf('plugins' + path.sep) === 0) {
            var plugin = appRelPath.substr(8);
            if (plugin) {
                plugin = plugin.substr(0, plugin.indexOf(path.sep));
            }
            
            for (var i = 0; i < settings.changeList.addedPlugins.length; i++) {
                var addedPlugin = settings.changeList.addedPlugins[i];
                if (addedPlugin === plugin ||
                    addedPlugin.indexOf(plugin + '@') === 0) {
                    return true;
                }
            }
        }
        
        if (settings.changeList.changedFilesIos && settings.changeList.changedFilesIos.indexOf(appRelPath) < 0) {
            return false;
        }
    }
    
    return true;
}

function preParsePluginsList(settings) {
    var pluginsPath = path.join(settings.projectSourceDir, 'plugins');
    if (!fs.existsSync(pluginsPath)) {
        return;
    }
    var pluginDirectories = fs.readdirSync(pluginsPath);
    
    pluginDirectories.forEach(function (pluginDirectory) {
        var fullPluginDirectory = path.join(pluginsPath, pluginDirectory);
        var fetchFilePath = path.join(fullPluginDirectory, '.fetch.json');
        if (fs.existsSync(fetchFilePath)) {
            var fetchFile = JSON.parse(fs.readFileSync(fetchFilePath, { encoding: 'utf-8' }));
            
            if (fetchFile.source && fetchFile.source.type && fetchFile.source.type !== 'local' && fetchFile.source.url) {
                if (settings.changeList.addedPlugins && settings.changeList.addedPlugins.indexOf(fetchFile.source.url) >= 0) {
                    var index = settings.changeList.addedPlugins.indexOf(fetchFile.source.url);
                    
                    settings.changeList.addedPlugins[index] = pluginDirectory;
                } else if (settings.changeList.deletedPluginsIos && settings.changeList.deletedPluginsIos.indexOf(fetchFile.source.url) >= 0) {
                    rimraf.sync(fullPluginDirectory);
                }
            }
        }
        
        if (settings.changeList.deletedPluginsIos && settings.changeList.deletedPluginsIos.indexOf(pluginDirectory) >= 0) {
            rimraf.sync(fullPluginDirectory);
        }
    });
}

function initializeForHttpsIfNecessary(settings) {
    settings.agent = remoteBuild.agent(settings.buildServerUrl, settings.certificateName);
}

function submitBuildRequestToServer(settings, appAsTgzStream) {
    var serverUrl = settings.buildServerUrl;
    var vcordova;
    
    var cordovaVersionType = util.getCliSpecType(settings.cordovaVersion);
    
    // If the version is a GIT repo URL, encode it
    if (cordovaVersionType == util.CordovaCliSpecType.URI) {
        vcordova = encodeURIComponent(settings.cordovaVersion);
    }
    else {
        vcordova = settings.cordovaVersion;
    }
    
    var cfg = settings.configuration ? settings.configuration.toLowerCase() : 'release';
    
    var deferred = Q.defer();
    var buildUrl = serverUrl + '/build/tasks?command=build&vcordova=' + vcordova + '&cfg=' + cfg;
    if (isDeviceBuild(settings)) {
        buildUrl += '&options=--device';
    }
    if (settings.isIncrementalBuild) {
        buildUrl += '&buildNumber=' + incrementalBuildNumber;
    }
    if (util.logLevel) {
        buildUrl += "&loglevel=" + util.logLevel;
    }
    console.info(res.getString('SubmittingRemoteBuild', buildUrl));
    
    appAsTgzStream.on('error', function (error) {
        deferred.reject(new Error(res.getString('ErrorUploadingRemoteBuild', serverUrl, error)));
    });
    appAsTgzStream.pipe(request.post(remoteBuild.httpOptions(buildUrl, settings), function (error, response, body) {
        if (error) {
            deferred.reject(errorFromRemoteBuildServer(serverUrl, error, 'ErrorUploadingRemoteBuild'));
        } else if (response.statusCode === 400) {
            // Build server sends back http 400 for invalid submissions with response like this. We will fail the build with a formatted message.
            // {"status": "Invalid build submission", "errors": ["The requested cordova version 3.5.0-0.2.4 is not supported by this build manager. Installed cordova version is 3.4.1-0.1.0"]}
            var errorsJson = JSON.parse(body);
            deferred.reject(new Error(errorsJson.status + ': ' + errorsJson.errors.toString()));
        } else if (response.statusCode === 202) {
            // Expect http 202 for a valid submission which is "Accepted" with a content-location to the Url to check for build status
            console.info(res.getString('NewRemoteBuildInfo', body));
            var buildInfo = JSON.parse(body);
            deferred.resolve(response.headers['content-location']);
        } else {
            deferred.reject(new Error(body));
        }
    }));
    
    return deferred.promise;
}

/*
Status progression: uploaded -> extracted -> building -> [complete|invalid|error] -> downloaded [if a device targeted build]
*/
function pollForBuildComplete(settings, buildingUrl, interval, attempts) {
    
    var thisAttempt = attempts + 1;
    console.info(res.getString('CheckingRemoteBuildStatus', (new Date()).toLocaleTimeString(), buildingUrl, thisAttempt));
    
    return util.promiseForHttpGet(remoteBuild.httpOptions(buildingUrl, settings)).
        then(function (responseAndBody) {
        if (responseAndBody.response.statusCode !== 200) {
            throw new Error('Http ' + responseAndBody.response.statusCode + ': ' + responseAndBody.body);
        }
        var buildInfo = JSON.parse(responseAndBody.body);
        var status = (buildInfo['status'] || 'error').toLowerCase();
        console.info(status + ' - ' + buildInfo['message']);
        if (status === 'complete') {
            return buildInfo;
        } else if (status === 'invalid') {
            throw new Error(res.getString('InvalidRemoteBuild', buildInfo['message']));
        } else if (status === 'error') {
            var err = new Error(res.getString('RemoteBuildError', buildInfo['message']));
            err.buildInfo = buildInfo;
            return err;
        }
        return Q.delay(interval).then(function () {
            return pollForBuildComplete(settings, buildingUrl, interval, thisAttempt);
        });
    });
}

function logBuildOutput(buildInfo, settings) {
    var serverUrl = settings.buildServerUrl;
    var deferred = Q.defer();
    var buildNumber = buildInfo['buildNumber'];
    var downloadUrl = serverUrl + '/build/tasks/' + buildNumber + '/log';
    console.info(res.getString('RemoteBuildLogFollows'));
    request(remoteBuild.httpOptions(downloadUrl, settings)).on('end', function () {
        deferred.resolve(buildInfo);
    }).pipe(process.stdout);
    return deferred.promise;
}

function downloadBuild(buildInfo, settings, toDir) {
    
    var serverUrl = settings.buildServerUrl;
    util.createDirectoryIfNecessary(toDir);
    var deferred = Q.defer();
    
    var buildNumber = buildInfo['buildNumber'];
    var downloadUrl = serverUrl + '/build/' + buildNumber + '/download';
    
    console.info(res.getString('DownloadingRemoteBuild', downloadUrl, toDir));
    var zipFile = path.join(toDir, buildNumber + '.zip');
    var outZip = fs.createWriteStream(zipFile);
    outZip.on('error', function (error) {
        deferred.reject(new Error(res.getString('ErrorDownloadingRemoteBuild', toDir, error)));
    });
    outZip.on('close', function () {
        console.info(res.getString('DownloadedRemoteBuild', toDir));
        deferred.resolve(zipFile);
    });
    request(remoteBuild.httpOptions(downloadUrl, settings)).pipe(outZip);
    
    return deferred.promise;
}

function downloadRemotePluginFile(buildInfo, settings, toDir) {
    
    var serverUrl = settings.buildServerUrl;
    var deferred = Q.defer();
    var buildNumber = buildInfo['buildNumber'];
    var downloadUrl = serverUrl + '/files/' + buildNumber + '/cordovaApp/plugins/ios.json';
    util.createDirectoryIfNecessary(toDir);
    
    request(remoteBuild.httpOptions(downloadUrl, settings)).on('end', function () {
        deferred.resolve(buildInfo);
    }).pipe(fs.createWriteStream(path.join(toDir, 'remote_ios.json')));
    
    return deferred.promise;
}

function unzipBuildFiles(zipFile, toDir) {
    
    console.info(res.getString('ExtractingRemoteBuild', toDir));
    util.createDirectoryIfNecessary(toDir);
    var deferred = Q.defer();
    
    try {
        var zip = new AdmZip(zipFile);
        zip.extractAllTo(toDir, true);
        console.info(res.getString('DoneExtractingRemoteBuild', toDir));
        fs.unlink(zipFile, function (err) {
            if (err) {
                console.info(res.getString('FailedToDeleteRemoteZip', zipFile));
            }
            deferred.resolve();
        });
    } catch (error) {
        deferred.reject(new Error(res.getString('ErrorDownloadingRemoteBuild', toDir, error)));
    }
    return deferred.promise;
}

function isDeviceBuild(settings) {
    return settings.buildTarget && settings.buildTarget.toLowerCase().match(/device/);
}

function throwErrorAfterDelay(delay, error) {
    return Q.delay(delay).then(function () {
        throw error;
    });
}
