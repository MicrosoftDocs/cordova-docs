<properties pageTitle="General Known Issues" 
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#**General Known Issues**
This article covers general known issues related to Visual Studio Tools for Apache Cordova. For version specific issues, see:

- [Known issues for Visual Studio 2015](known-issues-vs2015.md)
- [Known issues for Tools for Apache Cordova CTP 3/3.1](known-issues-vs2013.md)

##**Missing Platform Dropdown** 

The “Solution Platform” dropdown may not appear in the toolbar when upgrading Visual Studio 2013 from a previous version to Update 4. You can add using the “Standard Toolbar Options” dropdown as described in [Microsoft Support article 2954109](http://support.microsoft.com/kb/2954109).

##**Building a Cordova project from source control results in Cordova plugin APIs not returning results**

The following four json files can cause this to occur if added to source control.

- plugins/android.json
- plugins/ios.json
- plugins/windows.json
- plugins/remote_ios.json
- plugins/wp8.json.

Remove these files from source control if you are not checking in the "platforms" folder (recommended). For local copies, you can either fetch a fresh copy from source control or remove the above files along with platforms found in the "platforms" folder to resolve the issue. See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#missingexclude) for additional details.

##**Plugin with variables not working** 

Due to a Cordova issue with Cordova 4.3.0 and 4.3.1, you can run into problems with plugin variables in Cordova < 5.0.0. Plugin variable information is lost if you install the "plugin" before the "platform" which can happen depending on your workflow. They do, however, function in Cordova 5.1.1 which you can use with VS 2015. Follow these steps to use a plugin with variables:

 1. Remove the plugins with the variables via the config designer.

 2. Update to Cordova 5.1.1 via the config designer (Platforms > Cordova CLI)

 3. Re-add your plugin via "Plugins" tab in the config.xml designer

##**Slow first build or first plugin add** 

The first build or plugin add for a given version of Cordova will be slower than subsequent builds as VS must first dynamically acquire Cordova. See the Output Window for more detail on progress. Further, the first remote iOS build will exhibit the same behavior as the agent downloads Cordova on your OSX machine. If you encounter a CordovaModuleLoadError with the first iOS build for a given Cordova version you can follow [these instructions](../tips-and-workarounds/ios/tips-and-workarounds-ios-readme.md#npm-cache) to resolve the problem.

##**Old versions of Cordova plugins due to Cordova plugin ID changes** 

A significant change occurred with Cordova 5.0.0+ that also altered the IDs of many core Cordova plugins. The Visual Studio 2015 config.xml designer uses the old IDs (ex: org.apache.cordova.camera not cordova-plugin-camera) with Cordova 4.3.1 and below since this version of the Cordova  < 5.0.0 do not support npm.

If you update your Cordova version to 5.1.1 or later the config.xml designer will automatically switch to using the new IDs. If you do not see this behavior, update Tools for Apache Cordova. Some very early adopters may not see some of the improvments described in this document until after you update since a small post-RTM update enabled this functionality. You will get an update notification soon prompting you to update or you can click "Install Tools for Apache Cordova" from the Apache Cordova templates section when creating a new project. Be sure to remove plugins using older IDs from your project before adding the updated plugins with the new IDs.

##**Git sourced plugins will not install** 

Git sourced plugins will not install properly if you have not installed the [Git command line tools](http://www.git-scm.com/downloads) and have them in your system path. During installation of the Git tools, select the "Use Git from the Windows Command Prompt" option or add the "bin" folder from the Git install location to your path and restart VS. (Usually "C:\Program Files (x86)\Git\bin").

##**Git sourced plugins will not install with Cordova 5.1.1 only** 

Cordova 5.1.1 has a bug that can cause plugins installed from a Git repo to fail with the error "Error: EXDEV, cross-device link not permitted" if the project is on a different drive than your temp folder.

See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#plugin-xml) for information on adding plugins not in the config designer from either the Cordova plugin repository or npm. If you must add a Git version of the plugin, either move your project to the same drive as your temp folder when installing or you can instead download a copy, unzip it, and add the plugin from the filesystem.

##**TypeError: Request path contains unescaped characters**

When building or installing a plugin you may encounter this error if you are using a proxy with certain versions of Node.js and Cordova after a "npm http GET". This is a Cordova issue and the simplest workaround is to downgrade [Node.js 0.10.29](http://nodejs.org/dist/v0.10.29/). This will be resolved in a future version of Cordova. See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#cordovaproxy) for additional details.

##**Errors from npm related to permission problems** 

If you installed Visual Studio or Node.js running as an administrator, you can run into problems where npm attempts to install npm packages under "C:\Program Files (x86)\node.js". You will typically see errors in the Output Window similar to this one: "npm ERR! error rolling back error : EPERM, unlink 'C:\Program Files (x86)\nodejs\vs-tac-cli.cmd'". To resolve this issue you can re-install Node.js or reconfigured npm using these commands from the command prompt and restarting Visual Studio:

~~~~~~~~~~~~~~~~~~~~~~~
npm config set prefix %APPDATA%\npm
npm config set cache %APPDATA%\npm-cache
~~~~~~~~~~~~~~~~~~~~~~~

##**Frequent ECONRESET errors from npm when using VPN or proxy** 

Node.js can experience intermittent issues connecting to the npm repository via SSL with certain versions of Node.js and npm when connected to VPN or when a proxy is configured. You can resolve this issue by configuring npm to connect to the registry using straight HTTP instead using this command from the command prompt:

~~~~~~~~~~~~~~~~~~~~~~~
npm config set registry http://registry.npmjs.org
~~~~~~~~~~~~~~~~~~~~~~~

##**FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory** 

This error can occur if you are using a recent version of Node.js (ex: 0.12.4) due to a [known npm issue](https://github.com/npm/npm/issues/8019). The simplest solution is to downgrade to [Node.js 0.10.29](http://nodejs.org/dist/v0.10.29/).

##**Globally installed npm packages not available from command line** 

If you have installed Visual Studio or Node.js with a different user than you are logging into Windows, you may need to update your path to access globally installed (npm install -g) npm packages from the command line. Specifically, ensure **%APPDATA%\npm** is either in your user or system PATH. By default the installation of Node.js will set the PATH as a user environment variable rather than system which is why you can encounter this behavior.

##**TypeScript code incorrectly identified as external, cannot read user configuration file** 

When using TypeScript, there are known issues that will incorrectly identify project items as external code or will fail to read in a user configuration file. To avoid unexpected behavior when working with a Cordova TypeScript project, turn off Just My Code (Options > Debugger > General > uncheck Enable Just My Code).

##**TypeScript breakpoints stop at the wrong location when using Ripple** 

This is a known issue that is being actively worked on. This problem does not occur when using devices or emulators.

##**Missing Intellisense**

* No IntelliSense is provided for Cordova plugins in JavaScript files in Apache Cordova projects. As a workaround, developers can enable IntelliSense for Cordova plugins by explicitly adding “/// &lt;reference group="Implicit (Multi-Device Apps)” /&gt;” to the JavaScript file.

* No IntelliSense is provided within JavaScript files for other JavaScript files included via a script tag in a referring HTML page. As a workaround, developers can enable IntelliSense for other referenced JavaScript files by explicitly adding “/// &lt;reference path=”referencedFile.js” /&gt;” to the JavaScript file.

##**"res" folder contents cannot be referenced from web content**

By design, the contents of the “res” folder cannot be accessed by web content as they are copied into platform-specific native project locations.

##**Mixed case file added as lower case reference** 

Dragging a mixed-case file into an HTML page creates a lowercase script or style reference which will cause it to not be found on Android and iOS. Manually update the reference with the correct casing.

##**Visual Studio hangs when creating or opening a Cordova jsproj** 

Follow the steps [in this MSDN blog post](https://social.msdn.microsoft.com/Forums/en-US/0e5115ca-83a7-4294-8740-289b3f453fca/rtm-known-issue-package-load-failure-when-creating-a-windows-app-project-with-javascript-or-hang).
