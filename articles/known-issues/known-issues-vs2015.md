<properties pageTitle="Known Issues - Visual Studio 2015" 
  description="This is an article on bower tutorial" 
  services="" 
  documentationCenter=""
  authors="bursteg" />

#**Known Issues - Visual Studio 2015**
This article covers known issues specific to Visual Studio Tools for Apache Cordova 2015. 

##**Project structure change from CTP3/3.1** 

Projects created in an earlier version of Visual Studio will need to be migrated to support the new Cordova CLI based project structure in VS 2015 that is more interoperable with 3rd party tools and CLIs. 

To migrate your previous projects to the new structure:

 1. Make a backup of your existing project (obligatory first step :))
 2. Create a new project using the JavaScript \ Apache Cordova Apps \
    Blank App template
	 * For TypeScript projects, you can use the TypeScript equivalent of this same project
 3. Copy the .jsproj and taco.json files created by this template into your own project's folder
 4. In your project, create a new folder named www
 5. Delete the following folders from your project's folder:
	 * bin
	 * bld
 8. Leave the following folders/files in your project directory:
	 * merges
	 * res
	 * plugins
	 * config.xml
 13. Copy all other files/folders into the www folder
 14. If you're using TypeScript, you'll need to add a tsconfig.json to your project folder and define config settings for your project. See the [Configuring TypeScript](../getting-started/tutorial-typescript.md) section for details.
 15. Now you can build and run your application

If you have errors, you may need to update file references to reflect the new folder structure. 

Lastly, you should add the following XML elements to your config.xml to ensure your icons and splash screens are picked up by right clicking on the file and selecting "View Code":

  ~~~~~~~~~~~~~~~~~~~~~~
  <platform name="android">
    <icon src="res/icons/android/icon-36-ldpi.png" density="ldpi" />
    <icon src="res/icons/android/icon-48-mdpi.png" density="mdpi" />
    <icon src="res/icons/android/icon-72-hdpi.png" density="hdpi" />
    <icon src="res/icons/android/icon-96-xhdpi.png" density="xhdpi" />
  </platform>
  <platform name="ios">
    <icon src="res/icons/ios/icon-60-3x.png" width="180" height="180" />
    <icon src="res/icons/ios/icon-60.png" width="60" height="60" />
    <icon src="res/icons/ios/icon-60-2x.png" width="120" height="120" />
    <icon src="res/icons/ios/icon-76.png" width="76" height="76" />
    <icon src="res/icons/ios/icon-76-2x.png" width="152" height="152" />
    <icon src="res/icons/ios/icon-40.png" width="40" height="40" />
    <icon src="res/icons/ios/icon-40-2x.png" width="80" height="80" />
    <icon src="res/icons/ios/icon-57.png" width="57" height="57" />
    <icon src="res/icons/ios/icon-57-2x.png" width="114" height="114" />
    <icon src="res/icons/ios/icon-72.png" width="72" height="72" />
    <icon src="res/icons/ios/icon-72-2x.png" width="144" height="144" />
    <icon src="res/icons/ios/icon-small.png" width="29" height="29" />
    <icon src="res/icons/ios/icon-small-2x.png" width="58" height="58" />
    <icon src="res/icons/ios/icon-50.png" width="50" height="50" />
    <icon src="res/icons/ios/icon-50-2x.png" width="100" height="100" />
  </platform>
  <platform name="windows">
    <icon src="res/icons/windows/Square150x150Logo.scale-100.png" width="150" height="150" />
    <icon src="res/icons/windows/Square150x150Logo.scale-240.png" width="360" height="360" />
    <icon src="res/icons/windows/Square30x30Logo.scale-100.png" width="30" height="30" />
    <icon src="res/icons/windows/Square310x310Logo.scale-100.png" width="310" height="310" />
    <icon src="res/icons/windows/Square44x44Logo.scale-240.png" width="106" height="106" />
    <icon src="res/icons/windows/Square70x70Logo.scale-100.png" width="70" height="70" />
    <icon src="res/icons/windows/Square71x71Logo.scale-240.png" width="170" height="170" />
    <icon src="res/icons/windows/StoreLogo.scale-100.png" width="50" height="50" />
    <icon src="res/icons/windows/StoreLogo.scale-240.png" width="120" height="120" />
    <icon src="res/icons/windows/Wide310x150Logo.scale-100.png" width="310" height="150" />
    <icon src="res/icons/windows/Wide310x150Logo.scale-240.png" width="744" height="360" />
  </platform>
  <platform name="wp8">
    <icon src="res/icons/wp8/ApplicationIcon.png" width="62" height="62" />
    <icon src="res/icons/wp8/Background.png" width="173" height="173" />
  </platform>
  <platform name="android">
    <splash src="res/screens/android/screen-hdpi-landscape.png" density="land-hdpi"/>
    <splash src="res/screens/android/screen-ldpi-landscape.png" density="land-ldpi"/>
    <splash src="res/screens/android/screen-mdpi-landscape.png" density="land-mdpi"/>
    <splash src="res/screens/android/screen-xhdpi-landscape.png" density="land-xhdpi"/>
    <splash src="res/screens/android/screen-hdpi-portrait.png" density="port-hdpi"/>
    <splash src="res/screens/android/screen-ldpi-portrait.png" density="port-ldpi"/>
    <splash src="res/screens/android/screen-mdpi-portrait.png" density="port-mdpi"/>
    <splash src="res/screens/android/screen-xhdpi-portrait.png" density="port-xhdpi"/>
  </platform>
  <platform name="ios">
    <splash src="res/screens/ios/screen-iphone-portrait.png" width="320" height="480"/>
    <splash src="res/screens/ios/screen-iphone-portrait-2x.png" width="640" height="960"/>
    <splash src="res/screens/ios/screen-ipad-portrait.png" width="768" height="1024"/>
    <splash src="res/screens/ios/screen-ipad-portrait-2x.png" width="1536" height="2048"/>
    <splash src="res/screens/ios/screen-ipad-landscape.png" width="1024" height="768"/>
    <splash src="res/screens/ios/screen-ipad-landscape-2x.png" width="2048" height="1536"/>
    <splash src="res/screens/ios/screen-iphone-568h-2x.png" width="640" height="1136"/>
    <splash src="res/screens/ios/screen-iphone-portrait-667h.png" width="750" height="1334"/>
    <splash src="res/screens/ios/screen-iphone-portrait-736h.png" width="1242" height="2208"/>
    <splash src="res/screens/ios/screen-iphone-landscape-736h.png" width="2208" height="1242"/>
  </platform>
  <platform name="windows">
    <splash src="res/screens/windows/SplashScreen.scale-100.png" width="620" height="300"/>
    <splash src="res/screens/windows/SplashScreen.scale-240.png" width="1152" height="1920"/>
    <splash src="res/screens/windows/SplashScreenPhone.scale-240.png" width="1152" height="1920"/>
  </platform>
  <platform name="wp8">
    <splash src="res/screens/wp8/SplashScreenImage.jpg" width="480" height="800"/>
  </platform>
  ~~~~~~~~~~~~~~~~~~~~~~

##Visual Studio 2015 RTM
**The debug dropdown just shows up 'Start' and no other target options such as Ripple, devices, emulators & simulators:**
In some cases, when you uninstall VS2013 or a previous version (RC) of VS2015, a library gets corrupted that causes the debug dropdown not to show all the target options. To resolve this issue:
 1. Close all VS instances
 2. cd %appdata%\Local\Microsoft\Phone Tools”
 3. rename CoreCon folder
 4. Launch VS again.

----------
**vs-ms-remote reports a 404 error when using VS 2015 RTM or later:** VS 2015 RTM and up uses a new "remotebuild" agent instead of vs-mda-remote. See [remotebuild installation instructions](http://go.microsoft.com/fwlink/?LinkID=533745) for details.

----------
**iOS Simulator does not work when using the remotebuild agent and VS 2015 RTM:** You need to install version 3.1.1 of the ios-sim node module. Run "npm install -g ios-sim@3.1.1" from the Terminal app in OSX to install. See [remotebuild installation instructions](http://go.microsoft.com/fwlink/?LinkID=533745) for details.

----------
**iPhone 4S Simulator appears when selecting iPad or other device when using the remotebuild agent and VS 2015 RTM:** You need to install version 3.1.1 of the ios-sim node module. Run "npm install -g ios-sim@3.1.1" from the Terminal app in OSX to install. See [remotebuild installation instructions ](http://go.microsoft.com/fwlink/?LinkID=533745) for details.

----------
**Existing vs-mda-remote settings in Visual Studio do not work with the remotebuild agent:** You will need to generate and use a new PIN when setting up Visual Studio to connect to the remotebuild agent for the first time. If you are not using secure mode, turn secure mode on and then off again to cause VS to reinitalize. See [remotebuild installation instructions](http://go.microsoft.com/fwlink/?LinkID=533745) for details.

----------
**config.xml Designer Does Not Show Updated Plugin IDs with Cordova 5.0.0+:** A significant change occurred with Cordova 5.0.0+ that also altered the IDs of many core Cordova plugins. The Visual Studio 2015 config.xml designer uses the old IDs (ex: org.apache.cordova.camera not cordova-plugin-camera) with Cordova 4.3.1 and below since this version of the Cordova < 5.0.0 do not support npm. 

However, if you update your Cordova version to 5.0.0 or later the config.xml designer should automatically see the new IDs in the "Plugins" tab of the designer. If you do not see this behavior, update Tools for Apache Cordova since a small post-RTM update enabled this functionality. You will get an update notification soon prompting you to update or you can click "Install Tools for Apache Cordova" from the Apache Cordova templates section when creating a new project. Be sure to remove plugins with the older IDs before updating via the "Installed" tab to avoid unexpected behaviors.

##Visual Studio 2015 RC
----------
**VS 2015 RC and Cordova 5.x.x / Cordova Android 4.x.x:** See [Cordova 5.x.x known issues](known-issues-cordova5.md) for details on Android related issues that are specific to Cordova 5.0.0 and up.

----------
**Old versions of Cordova plugins due to Cordova plugin ID changes:** A significant change occurred with Cordova 5.0.0+ that also altered the IDs of many core Cordova plugins. The Visual Studio 2015 RC config.xml designer uses the old IDs (ex: org.apache.cordova.camera not cordova-plugin-camera) because Cordova 4.3.1 and below cannot access plugins using these new IDs and the default template uses 4.3.0. 

To install updated plugins, follow [this proceedure to install a npm sourced plugin](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#plugin-npm). 

*Note that these updated plugins were tested on Cordova 5.0.0 or later and therefore may or may not work on earlier versions of Cordova.* We advise against updating your plugins when using older versions of Cordova unless you are attempting to solve a specific problem.

----------
**Building a Cordova project from source control results in Cordova plugin APIs not returning results:** The following four json files can cause this to occur if added to source control.

- plugins/android.json
- plugins/ios.json
- plugins/windows.json
- plugins/remote_ios.json
- plugins/wp8.json.

Remove these files from source control if you are not checking in the "platforms" folder (reccomended). For local copies, you can either fetch a fresh copy from source control or remove the above files along with platforms found in the "platforms" folder to resolve the issue. See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#missingexclude) for additional details.

----------
**Plugin with variables not working:** Due to a Cordova issue with Cordova 4.3.0 and a bug in VS 2015 RC, you can run into problems with plugin variables in Cordova < 5.0.0. Plugin variable information is lost if you install the "plugin" before the "platform" which can happen depending on your workflow. They do, however, function in Cordova 5.1.1 which you can use with VS 2015 RC. To update to 5.1.1 and use plugin variables, you will need to update your VS project and use the command line.

 1. Remove the plugins with the variables via the config designer.

 2. Update to Cordova 5.1.1 via the config designer (Platforms > Cordova CLI)

 3. From the command line:
	 1. Go to your project directory.
	 2. Type the following from substituting project path, plugin name, and variables for those that apply to you:
        
	    ~~~~~~~~~~~~~~
        cd <project path>
		npm install -g cordova@5.1.1 
        cordova plugin add nl.x-services.plugins.launchmyapp --variable URL_SCHEME=myscheme
	    ~~~~~~~~~~~~~~

##Visual Studio 2015 CTP6
----------
**Ant uninstalled when upgrading from CTP5 to CTP6:** When you upgrade from VS2015 CTP5 to CTP6, Apache Ant gets uninstalled. The workaround is to reinstall Ant. You can find manual instructions for installing and configuring Ant at [this location](https://msdn.microsoft.com/en-us/library/dn757054.aspx#InstallTools).
