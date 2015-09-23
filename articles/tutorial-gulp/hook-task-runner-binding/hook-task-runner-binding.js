/*
  Copyright (c) Microsoft. All rights reserved.  
  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

var exec, fork, fs, path, Q, hookTasks;

module.exports = function (context) {

    // Skip processing if being called from within Visual Studio
    if (process.env["VisualStudioEdition"]) {
    	return;
    }

    fs = require('fs');
    path = require('path');
    Q = context.requireCordovaModule('q');
    exec = Q.nfbind(require('child_process').exec);
    fork = require('child_process').fork;

    // Syntax:
        /// <binding BeforeBuild='before-build' AfterBuild='after-build' Clean='after-build' />
    
    // Check gulpfile.js for tasks to run for this hook
    if (fs.existsSync(path.join(process.cwd(), "gulpfile.js"))) {
        // Hooktasks should be cached after first execution since its at the module level
        if (!hookTasks) {
            console.log("Checking gulpfile for tasks to run for Cordova events.")
            hookTasks = {};
            var gulpfile = fs.readFileSync("gulpfile.js", "utf8");
            var matches = gulpfile.match(/\/\/\/\s<binding(.+)(?=\/>)/ig);
            if (matches) {
                var bindings = matches[0].split(" ");
                bindings.forEach(function (binding) {
                    binding = binding.replace(/["|']/g, "");
                    var bindParts = binding.split("=")
                    var hook = bindParts[0];
                    var task = bindParts[1];
                    if (hook.indexOf("_") == -1) {
                        switch (hook) {
                            case "BeforeBuild": hook = "before_prepare"; break;
                            case "AfterBuild": hook = "after_compile"; break;
                            case "Clean": return;           // No cordova clean event
                            case "ProjectOpened": return;   // No cordova project open event
                        }
                    } else {
                        hook = hook.toLowerCase();
                    }
                    if (hookTasks[hook]) {
                        hookTasks[hook].push(task);
                    } else {
                        hookTasks[hook] = [task];
                    }
                });
            }
        }

        if (hookTasks[context.hook]) {
            // Install dependencies in package.json if gulp not present - Run the task either way
            if (!fs.existsSync(path.join(process.cwd(), "node_modules", "gulp"))) {
                console.log("Gulp not found. Installing package dependencies.")
                return exec("npm install")
                    .then(function (result) {
                        console.log(result[0]);
                        if (result[1] != "") {
                            console.error(result[1]);
                        };
                    })
                    .then(function () { return runGulpTask(context.hook); });
            } else {
                return runGulpTask(context.hook);
            }
        }
    }

    function runGulpTask(hook) {
        var deferred = Q.defer();
        console.log("Running gulp task " + hookTasks[hook] + " for Cordova event " + hook);
        var child = fork("./node_modules/gulp/bin/gulp.js", hookTasks[hook]);
        child.on("error", function (err) {
            deferred.reject(err);
        });
        child.on("exit", function (code, signal) {
            if (code === 0 && signal === null) {
                deferred.resolve();
            } else {
                deferred.reject("Non-zero exit code or signal. Code: " + code + ", Signal: " + signal);
            }
        });
        return deferred.promise;
    }

};

