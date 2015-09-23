<properties pageTitle="Build Cordova apps in a Team / Continuous Integration (CI) environment"
  description="Build Cordova apps in a Team / Continuous Integration (CI) environment"
  services=""
  documentationCenter=""
  authors="bursteg" />

# Build Cordova apps in a Team / Continuous Integration (CI) environment
**Note that this documentation applies to Visual Studio 2015 and does not apply to Visual Studio 2013 CTPs.**

With the release of Visual Studio 2015, you now have a number of options for how you can integrate Cordova apps with your favorite team / continuous integration (CI) server thanks to the fact that projects created in Visual Studio are standard [Apache Cordova Command Line Interface](http://go.microsoft.com/fwlink/?LinkID=533773) (CLI) projects. In this tutorial, we will cover a few different approaches for building Cordova projects outside of Visual Studio.

For abridged informaiton on specific build systems, you may find this sample [taco-team-build node module](http://go.microsoft.com/fwlink/?LinkID=533736) useful along with the following tutorials:

*  [Getting Started with Cordova & TFS 2015 or Visual Studio Online](./tfs2015.md)
*  [Getting Started with Cordova & TFS 2013](./tfs2013.md)
*  [Getting Started with Cordova & Jenkins CI](./jenkins.md)
*  [Getting Started with Cordova & Automating Builds with Gulp](../tutorial-gulp/gulp-ci.md)

Read these articles to get up and running quickly!

This remainder of this article will go through the general approach for tackling a number challenges that exist when building Cordova apps and cover what the [taco-team-build node module](http://go.microsoft.com/fwlink/?LinkID=533736) effectively does behind the scenes.

>**Note** Team Foundation Services 2013 cannot easily take advantage of the workflow described here (though 2015 can) as it is MSBuild based. See the [Team Foundation Services 2013](http://go.microsoft.com/fwlink/?LinkID=533770) tutorial for details.

<a name="whattoadd"></a>
##What to Add to Source Control
On the surface, this seems like all files in a given Cordova project should be added to source control. However, to avoid unexpected issues, we recommend excluding the following files and folders from source control.

* The following folders should be excluded:
	- platforms
	- bld
	- .vs
* The following files should be excluded:
	- plugins/android.json
	- plugins/windows.json
	- plugins/wp8.json
	- plugins/ios.json
	- plugins/remote_ios.json
	- changeList.json
	- *.suo
	- *.jsproj.user

**Troubleshooting Tip:** Adding plugins/android.json, plugins/ios.json, plugins/remote_ios.json, plugins/windows.json, or plugins/wp8.json adding these files to source control can result in a build that **appears to succeed but is missing plugin native code.** They should only be included if the "platforms" folder is also checked in which is not recommended. Simply remove these files from source control to resolve the issue.

Note that you **can** add "plugins/fetch.json" to source control along with the rest of the contents of the plugins folder. See [our Issues, Tips, and Workarounds documentation](../tips-and-workarounds/tips-and-workarounds-readme.md) for additional tips on addressing common build issues.

<a name="basic"></a>
##Basic Workflow
Each build server technology is a bit different and in this article we will focus on the general steps required to build a Cordova app regardless of technology using the Cordova Command Line Interface.

The basic flow for building a Cordova app is simple on the surface:

1.  Check the project out from source control

2.  Add the platforms you want to build to the project using the "cordova platform add" command. Ex:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	cordova platform add android
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3.  Build the project using the "cordova build" command:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cordova build android --release
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The Cordova CLI is node.js based, so these exact same steps can be run from Windows or an OSX machine or from a cloud hosted VM like [MacInCloud](http://go.microsoft.com/fwlink/?LinkID=533746). See the [Cordova CLI documentation](http://go.microsoft.com/fwlink/?LinkID=533773) for additional details.

Exactly how these steps are executed will vary depending on your build server. However, there are a **number of challenges that may not be immediately obvious** when setting up an automated build environment. This are article will describe some techniques for dealing with these common problems.

###A Note on TypeScript
Unlike Visual Studio, it's important to note that the base Cordova CLI does not itself automatically compile TypeScript code. If you are using a build language like Gulp or Grunt, there are convenient plugins that you can use to compile your TypeScript code. Otherwise there is also a node.js based command line utility that works both on Windows and OSX. See the following links for additional details:

-   [Compiling TypeScript from the command line](http://go.microsoft.com/fwlink/?LinkID=533802)
-   [gulp-typescript](http://go.microsoft.com/fwlink/?LinkID=533748)
-   [grunt-typescript](http://go.microsoft.com/fwlink/?LinkID=533779)

<a name="depends"></a>
##Installing Dependencies
Cordova builds require that a number of dependencies be properly installed and configured on the system. However, exactly which dependencies are required varies based on the Cordova "platform" (Android, iOS, Windows 8.0/8.1 and Phone 8.1, Windows Phone 8.0) you want to build.

Installing Visual Studio 2015 with the Tools for Apache Cordova option will automatically install these dependencies but you will still need to configure some of the environment variables by hand for Android. See [Team Foundation Services 2015 and Visual Studio Online](./tfs2015.md) for a summary of these variables.

Otherwise you can manually install only those dependencies that are needed for building the platforms you are interested in.

1.  Install Node.js and make sure it is available to the system user you intend to have run your builds

2.  Install the platform specific dependencies on the server and make them available to this same user. See the following guides for details:

    1.   [Android Platform Guide](http://go.microsoft.com/fwlink/?LinkID=533774)

        1.  You do not need to install Android Studio or Eclipse

        2.  Instead you may download and install one of the ["SDK Tools Only" packages](http://go.microsoft.com/fwlink/?LinkID=533747).

        3.  When building, you may encounter an error telling you that you need to install specific SDK versions or tools depending on the version of Cordova you are using. Note that these messages are talking about the *tools and SDK* versions *not* the device target versions.

        	1.  You can install additional SDKs using [the Android SDK Manager](http://go.microsoft.com/fwlink/?LinkID=533775).

        	2. Note that only the "SDK Platform" is required for a given API level so you may uncheck other options. Android system images in particular are large and are not needed.

        	3.  Be sure to also install the "platform tools"

        	4.  Projects created using Visual Studio will typically use either the API SDK 19, 21, or API 22.

    2.   OSX only: [iOS Platform Guide](http://go.microsoft.com/fwlink/?LinkID=533776). You do not need to install the deployment tools mentioned.

    3.   Windows only:
        1.  [Windows and Windows Phone 8.1+ Platfrom Guide](http://go.microsoft.com/fwlink/?LinkID=533777)
        2.  [Windows Phone 8.0 Platform Guide](http://go.microsoft.com/fwlink/?LinkID=533778)

<a name="proxy"></a>
##Internet Access & Proxy Setup
If your build server is running in a datacenter, it may be very locked down and not have unrestricted access to the Internet. Due to dynamic acquistion requirements, you will need to allow the build servers to access the following domains:

- npm: http://registry.npmjs.org
- GitHub: https://github.com
- Apache ASF Git: https://git-wip-us.apache.org
- gradle.org: http://services.gradle.org
- maven.org: https://*.maven.org

If you need to use a proxy, you will need to configure both npm and Git command line tools to use them. Open a command prompt on Windows or the Terminal app on OSX and type the following:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
npm config set proxy http://<username>:<password>@<host>
npm config set https-proxy http://<username>:<password>@<host>
git config --global http.proxy http://<username>:<password>@<host>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

...where "&lt;username&gt;:&lt;password&gt;@" is optional and should contain the appropriate user name and password for proxy access while &lt;host&gt; is the correct proxy host and port (ex: myproxy.mycompany.com:8080).

You may also need to configure proxy settings for Java. This can be [accomplished via the Java control panel (reccomended)](http://java.com/en/download/help/proxy_setup.xml) or by setting an environment variable as the follows:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
JAVA_OPTS=-Dhttps.proxyHost=<host> -Dhttps.proxyPort=<port> -Dhttp.proxyHost=<host> -Dhttp.proxyPort=<port> -DproxySet=true
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally, if you see the error "**TypeError: Request path contains unescaped characters**" when building or installing a plugin you may need to downgrade [Node.js 0.10.29](http://nodejs.org/dist/v0.10.29/). See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#cordovaproxy) for additional details.

<a name="challenges"></a>
##Cordova Challenges
When building Cordova projects in a server environment, there are a number of challenges you may encounter. This tutorial will describe simple ways to handle these problems without going into specifics on particular CI servers so that this information can be adapted to your favorite build technology.

If you are looking for a quick solution you may want to read the [Gulp](../tutorial-gulp/gulp-ci.md) tutorial and [this Git repository](http://go.microsoft.com/fwlink/?LinkID=533736) with a sample taco-team-build node module designed to help resolve these problems regardless of build system.  

The challenges are as follows:

1.  **Building with Multiple Versions of the Cordova CLI.** While in an ideal world everyone would use the edge version of the Cordova CLI and associated platforms, the reality is that for a given build server you will want to use multiple versions of the Cordova CLI. This means that the common practice of installing Cordova [globally](http://go.microsoft.com/fwlink/?LinkID=533780) will not work.

2.  **Adding Cordova Platforms.** As of Cordova 4.3.0, the "cordova platform add" CLI command still needs to be explicitly run to build a platform unless you opted to check in the contents of the "platforms" folder which is not recommended. However, using the platform command can cause your build to fail under certain circumstances.

3.  **Generating an iOS App Store Package.** By default, the iOS build in Cordova generates an ".app" structure rather than an ".ipa" for device deployment. An ipa can be generated from the command line quite easily but build servers like Jenkins require an extra step.

4.  **Visual Studio Specific Features**
	1.  **Supporting res/native.** The "res/native" folder in Visual Studio projects provides a useful way to update native project build artifacts without having to check in the platforms folder. It is not currently a base Cordova CLI feature.
	2.  **Supporting Visual Studio specific Windows packaging settings.** Currently the Cordova CLI does not have a standard location for storing platform specific packaging information. While this is something actively being pursued by the community, Visual Studio uses a set of non-standard config.xml elements to store mandatory fields for store submission.
	3.  **Supporting the Task Runner Explorer.** Visual Studio now has a convenient Task Runner Explorer that allows you to attach Gulp and Grunt tasks to build events.

5. **OSX Gotchas.** If you spend most of your time developing in the Windows environment, there are a few common, easily resolved issues that can pop up when you start trying to build your project on OSX.

<a name="multicli"></a>
###Building with Multiple Versions of the Cordova CLI
The Cordova CLI is a standard Node.js npm package and thus can be installed either [globally or locally](http://go.microsoft.com/fwlink/?LinkID=533780). The trick, then, is to use a local installation of the Cordova CLI rather than a global one. There are two different methods that you can use to install Cordova locally: at the project level or in a global cache.

#### Project Level
Installing and using the correct version of the Cordova CLI at the project level is simple thanks to something called [package.json](http://go.microsoft.com/fwlink/?LinkID=533781). Here is the general approach:

1.  Create a package.json file in the root of your Cordova project.
2.  Add the following json to the file where "4.3.0" is the version of the Cordova CLI you intend to use:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    {
    	"devDependencies": {
    		"cordova": "4.3.0"
	    }
    }
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3.  Check this into source control with your project.

4.  Configure your build system to run the following command as its first task. This will then install the correct version of the CLI in a new "node\_modules" folder under your project.

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    npm install
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

5.  When executing a Cordova CLI command for your build task, you can then use the following commands:

	Windows:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	node_modules\cordova\bin\cordova
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	OSX:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	./node_modules/cordova/bin/cordova
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Ex:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ./node_modules/cordova/bin/cordova platform add android
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The downside of this method is that you will end up installing the Cordova CLI each time you execute a "clean" build which will slow down your build times particularly on Windows as the CLI consists of around 25mb of small files.

### Global Cache
To avoid re-installing each time, you can take advantage of Visual Studio's **taco.json** file and a Node.js script to perform the installation in a specific location that you then use to execute Cordova commands.

1.  Add an environment variable to your system (or build) called **CORDOVA\_CACHE** pointing to where you want to create "cache" of the different versions of the Cordova CLI used to build your projects.

2.  Add this node.js script to your project and call it "setup-cordova.js":

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var fs = require("fs"),
        path = require("path"),
        exec = require("child_process").exec;

    // Load taco.json
    var taco = require("./taco.json");
    var cordovaVersion = taco["cordova-cli"];

    // Check if Cordova is already present in the cache, install it if not
    var cordovaModulePath = path.resolve(process.env["CORDOVA_CACHE"], cordovaVersion);
    if (!fs.existsSync(cordovaModulePath)) {
        fs.mkdirSync(cordovaModulePath);
        fs.mkdirSync(path.join(cordovaModulePath, "node_modules"));
        console.log("Installing Cordova " + cordovaVersion + ".");
    	exec("npm install cordova@" + cordovaVersion, { cwd: cordovaModulePath }, function (err, stdout, stderr) {
            console.log(stdout);
            if (stderr) {
                console.error(stderr);
            }
            if (err) {
                console.error(err);
                process.exit(1);
            }
    		console.log("Cordova " + cordovaVersion + " installed at " + cordovaModulePath);
        });
    } else {
    	console.log("Cordova " + cordovaVersion + " already installed at " + cordovaModulePath);
    }

    // Create shell scripts
    if (process.platform == "darwin") {
        // OSX
	    fs.writeFileSync("cordova.sh", "#!/bin/sh\n" + path.join(cordovaModulePath, "node_modules", "cordova", "bin", "cordova") + " $@", "utf8");
        fs.chmodSync("cordova.sh", "0777")
    } else {
        // Windows
    	fs.writeFileSync("cordova.cmd", "@" + path.join(cordovaModulePath, "node_modules", "cordova", "bin", "cordova") + " %*", "utf8");
    }
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


3.  In your team / CI build definition or script, add a build task to execute "node setup-cordova.js" from your project root

4.  Use "./cordova.sh" (OSX) or "cordova.cmd" (Windows) to run additional Cordova commands

Note that this same script can be easily adapted to a [Gulp build task](http://go.microsoft.com/fwlink/?LinkID=533750). See the [Gulp](../tutorial-gulp/gulp-ci.md) tutorial for additional information.

<a name="platforms"></a>
###Adding Platforms
Adding platforms in Cordova is quite simple using the "cordova platform" command. Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
cordova platform add android
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

However, there are a couple of common problems when executing this command that you could run into.


1. **Platform Download Messages Result in Build Failures.** Where things can get a bit tricky is that Node.js emits warnings to "Standard Error."  The issue is that "platform add" command can result in warnings being reported when the CLI is downloading a version of a given Cordova platform for the first time. This is not an error, but some build systems will assume anything sent to standard error means a build failure occurred.

    Many CI systems provide a "continue on error" option that you can select to get around this particular problem or you can pipe standard error to standard out if you'd prefer.
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	cordova platform add ios 2>&1
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

2. **Errors During Incremental Builds.** If you are doing an incremental build and the platform you are building has already been added, the resulting exit code will be non-zero and may be interpreted as a build failure. If your build system supports a "continue on error" option for a given task, you can simply select that.

	However, a more robust solution is to simply conditionally call "platform add" if the appropriate folder in the platforms folder in your project is not found. In the scripts below replace "cordova" with the appropriate command from the "Building with Multiple Versions of the Cordova CLI" section above.

    Windows:

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    IF NOT EXIST platforms/android CALL cordova platform add android
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    OSX:

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if [ ! -d "platforms/android" ]; then cordova platform add android; fi;
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<a name="ipa"></a>
###Generating an iOS App Store Package
In order to distribute your iOS application you will need to generate an "iOS App Store Package" or "ipa" file. These files can be imported into iTunes or enterprise app stores in addition to being distributed to the Apple App Store via the [Application Loader](http://go.microsoft.com/fwlink/?LinkID=533751).

#### Using xcrun
Future versions of the Cordova CLI will likely support generating these archives directly. However, current state it is not supported so an Xcode command line tool needs to be used instead. Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
xcrun -v -sdk iphoneos PackageApplication source.app -o dest.ipa
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In Cordova projects, the source ".app" package can be found in the platforms/ios/build/device folder in your project after a successful Cordova "device" build. As an important detail, "source.app" and "dest.ipa" above should be **absolute paths** and the name of the package is taken from the "Display Name" (widget/@name) in config.xml which may not match your project folder name. Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
xcrun -v -sdk iphoneos PackageApplication "/Users/cdvusr/Documents/cordova/myapp/platforms/ios/build/device/My Cordova App.app" -o "/Users/cordova/Documents/cordova/myapp/platforms/ios/build/device/My Cordova App.ipa"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Each build system has a different mechanisms in place for passing the absolute path of the project to shell scripts, but typically it involves the use of an environment variable. For example, in Jenkins you can use the following:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
xcrun -v -sdk iphoneos PackageApplication "${WORKSPACE}/platforms/ios/build/device/My Cordova App.app" -o "${WORKSPACE}/platforms/ios/build/device/My Cordova App.ipa"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This command will automatically match a developer signing identitiy (when building Debug) or distribution (when building Release) signing identity based on the app's package name. When you are using res/native, you can place a custom [build-debug.xcconfig](http://go.microsoft.com/fwlink/?LinkID=533752) or [build-release.xcconfig](http://go.microsoft.com/fwlink/?LinkID=533782) file in res/native/ios/cordova in your Cordova project to override signing identities and other [build settings](http://go.microsoft.com/fwlink/?LinkID=533783) for these configurations.

However, additional command line arguments can also be passed such as "--sign" to resign the app using a specific signing identity or a path to a .p12 file and "--embed" to specify the path to a provisioning profile. Ex:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
xcrun -v -sdk iphoneos PackageApplication "${WORKSPACE}/platforms/ios/build/device/My Cordova App.app" -o "${WORKSPACE}/platforms/ios/build/device/My Cordova App.ipa" –-sign "/path/to/signing.p12" --embed "/path/to/some.mobileprovision"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#### Solving Keychain Permission Errors
When auto-matching, you may hit permissions issues when using a build server like [Jenkins](http://go.microsoft.com/fwlink/?LinkID=533784) because the build agent does not have permissions to access the login keychain. To solve this problem, you'll need to unlock the keychain before you build and package your Cordova app.

Most build servers provide a way to inject secure environment variables before executing build tasks. In Jenkins this is accomplished by using the "Environment Injector Plugin." By then setting a KEYCHAIN\_PWD environment variable you can add the following command to your build.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
security unlock-keychain -p ${KEYCHAIN_PWD} ${HOME}/Library/Keychains/login.keychain
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To then build and package your iOS app, you can run the following commands:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
security unlock-keychain -p ${KEYCHAIN_PWD} ${HOME}/Library/Keychains/login.keychain
cordova build ios --device --release
xcrun -v -sdk iphoneos PackageApplication "${WORKSPACE}/platforms/ios/build/device/My Cordova App.app" -o "${WORKSPACE}/platforms/ios/build/device/My Cordova App.ipa"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

<a name="vsspecific"></a>
###Visual Studio Specific Features
A quick way to get you project working with Visual Studio specific features outside of Cordova is to add the sample [Visual Studio Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753) to your project. It adds in support for three things:

1. Adds support for Visual Studio's res/native feature.
2. Adds in support for VS specific Windows packaging elements in config.xml.
3. Applies some workarounds for common problems when building for iOS.

##### Behind the Scenes: res/native Hook
If you are using Tools for Apache Cordova in Visual Studio, you may be taking advantage of the "res/native" folder in your project. This provides a useful way to update native project build artifacts without having to check in the platforms folder but is not currently a base Cordova CLI feature.

You can take a look at the sample [Tools for Apache Cordova CLI Support Plugin](http://go.microsoft.com/fwlink/?LinkID=533753) for a quick way to add in support. The plugin takes advantage of something called a [Cordova hook](http://go.microsoft.com/fwlink/?LinkID=533744) that allows you to wire in build steps in the Cordova CLI build process. A Cordova hook can be implemented using either shell scripts (batch, bash, or Node.js based) or as a node.js module.

For this behind the scenes tutorial, we'll use a Node.js based shell script for simplicity sake. All that needs to happen is the following script should be placed in the "hooks/before\_prepare" folder. We will call the file "hook-res-native.js" but the filename itself does not matter.

Add the following to the file:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#!/usr/bin/env node
var fs = require("fs"),
	path = require("path");

process.env["CORDOVA_PLATFORMS"].split(",").forEach(function(platform) {
	console.log("Processing res/native for " + platform);
	var resNative = path.join(process.cwd(), "res", "native", platform)
	if (fs.existsSync(resNative)) {
		copyFiles(resNative, path.join(process.cwd(), "platforms", platform));
	}
});

// Recursive copy function for res/native processing
function copyFiles(srcPath, destPath) {
	if (fs.statSync(srcPath).isDirectory()) {
		if (!fs.existsSync(destPath)) {
			fs.mkdirSync(destPath);
		}
		fs.readdirSync(srcPath).forEach(function (child) {
			copyFiles(path.join(srcPath, child), path.join(destPath, child));
		});
	} else {
		fs.writeFileSync(destPath, fs.readFileSync(srcPath));
	}
}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can place this into a "hooks\before_prepare" folder Visual Studio Cordova project and check it into source control and it will automatically be used.

<a name="osxgotcha"></a>
## OSX Gotchas: Troubleshooting Tips for Building on OSX
There are a few relativley common issues when building a Cordova app on OSX related to permissions that are worth noting.

1.  **You are seeing permission errors from "npm":** If you are seeing permission errors from "npm," you may be running into a situation where the build agent user's cache folder (~/.npm) is inaccessible. Generally this occurs if the folder or some of its contents was created while running as an administrator (sudo). Fortunately this is easy to resolve:

    1.  Log into OSX with the user that installed and set up the cross-platform agent
    2.  Open the Terminal app and type:

        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        sudo npm cache clear
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    3.  Next, type:

        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        sudo chown -R `whoami` ~/.npm
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3.  **You checked in the "platforms" folder from Windows and are seeing permission errors:** If you are seeing errors that are originating from files in your project's "platforms" folder, the root cause may be that you checked in shell scripts under the "platforms/android/cordova" or "platforms/ios/cordova" folders from Windows. This is because the NTFS file system has no concept of an "execute bit" that is required to run these from OSX. (The contents of the platforms is generally not intended for checked in and by default are excluded from Cordova projects in Visual Studio as a result.)

    For example, this error is saying the "version" script is not executable:

	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   [17:41:57] Error:
   /Users/vsoagent/vsoagent/agent/work/build/b424d56537be4854de825289f019285698609afddf826d5d1a185eb60b806e47/repo/tfs-vnext test/platforms/android/cordova/version:
   Command failed with exit code EACCES
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   To resolve this problem you have two options:
	1.  Don't check in the contents of the "platforms" folder into source control. This is by far the path of least resistance. The Gulp build script can add them at the time you build.
	2.  If you absolutely must check in the contents of the platforms folder from Windows, you can craft a shell script to set the execute bits on these files and include it as a part of your build process. There is also a [**Cordova hook based version of this script**](../tips-and-workarounds/ios/osx-set-execute/tips-and-workarounds-ios-osx-set-execute-readme.md) available in the tips and workarounds section.
	    1.  Create a shell script called "set-execute.sh" with the following contents:

            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            #!/bin/sh
            find -E platforms/ios/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
            find -E platforms/android/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
            find -E platforms/windows/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
            find -E platforms/wp8/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    	2.  Add this file to your project in Visual Studio and check it into source control

    	3.  Add a "shell script" build step at the very beginning of your build definition that runs the above script.

## More Information
* [Read tutorials and learn about tips, tricks, and known issues](../cordova-docs-readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Read MSDN docs on using Visual Studio Tools for Apache Cordova](http://go.microsoft.com/fwlink/?LinkID=533794)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)
