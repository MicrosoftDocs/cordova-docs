<properties pageTitle="Apache Cordova 5.x.x Related Known Issues" 
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#**Apache Cordova 5.x.x Related Known Issues**
This article covers [known issues](../cordova-docs-readme.md#knownissues) related to Visual Studio Tools for Apache Cordova 2015 when building or deploying using Apache Cordova 5.0.0+.

In general we recommend **using Cordova 5.1.1 or above** instead of 5.0.0 as there are a number of issues including a security hole with Cordova 5.0.0.

##Apache Cordova 5.x.x General Issues
----------
**config.xml Designer Does Not Show Updated Plugin IDs with Cordova 5.0.0+:** A significant change occurred with Cordova 5.0.0+ that also altered the IDs of many core Cordova plugins. The Visual Studio 2015 config.xml designer uses the old IDs (ex: org.apache.cordova.camera not cordova-plugin-camera) with Cordova 4.3.1 and below since this version of the Cordova < 5.0.0 do not support npm.

However, if you update your Cordova version to 5.0.0 or later the config.xml designer should automatically see the new IDs in the "Plugins" tab of the designer. If you do not see this behavior, update Tools for Apache Cordova since a small post-RTM update enabled this functionality. Some very early adopters may not see some of the improvments described in this document until after you update. You will get an update notification soon prompting you to update or you can click "Install Tools for Apache Cordova" from the Apache Cordova templates section when creating a new project. Be sure to remove plugins with the older IDs before updating via the "Installed" tab to avoid unexpected behaviors.

----------
**Cannot access any network resources from Android app:** The Android platform contained within Cordova 5.0.0+ does not have a "whitelist" plugin installed by default and therefore blocks network access by default. There are now two whitelist plugins that can be installed:

- Installing “cordova-plugin-whitelist” is the recommended whitelist plugin and results in some new behaviors and introduces new config.xml elements that can be added manually by right clicking on config.xml and selecting "View Code." You can install it from the command line or by adding this XML element to config.xml (see [this article for more details](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#plugin-xml)):

    ~~~~~~~~~~~~~~~~~
    <vs:plugin name="cordova-plugin-whitelist" version="1.1.0" />
    ~~~~~~~~~~~~~~~~~

- Installing “cordova-plugin-legacy-whitelist” will cause the platform to behave the way it did in 4.x and enables the "Domain Access" list in the configuration designer. You can install it from the command
line or by adding this XML element to config.xml (see [this article for more details](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#plugin-xml)):

    ~~~~~~~~~~~~~~~~~
    <vs:plugin name="cordova-plugin-legacy-whitelist" version="1.1.0" />
    ~~~~~~~~~~~~~~~~~    

----------
**Error when adding plugin using Git URI with Cordova 5.1.1:** Cordova 5.1.1 has a bug that can cause plugins installed from a Git repo to fail with the error **Error: EXDEV, cross-device link not permitted** if the project is on a different drive than your temp folder.

See [tips and workarounds](../tips-and-workarounds/general/tips-and-workarounds-general-readme.md#plugin-xml) for information on adding plugins not in the config designer from either the Cordova plugin repository or npm. If you must add a Git version of the plugin, either move your project to the same drive as your temp folder when installing or you can instead download a copy, unzip it, and add the plugin from the filesystem.

----------
**Missing Android SDK 22:** The Android platform in Cordova 5.0.0 requires Android SDK API Level 22 which may not be installed on your system. Install the SDK using the Android SDK manager.

----------
**Ripple throws error when starting up Cordova 5.0.0:** Ripple does not function properly in Cordova 5.0.0 due to a newly introduced validation check. This problem was fixed in Cordova 5.1.1.

## Known issues with Apache Cordova 5.x.x and Visual Studio 2015 RC
----------
**Visual Studio 2015 RC uses Ant to build Android with Cordova 5.x.x:** Visual Studio 2015 RC uses Ant to build Android while the command line has switched to Gradle by default in version 5.0.0 of the CLI. When switching between Visual Studio and the command line with the version of Android in Cordova 5.0.0, you may want to specify that the platform should be built with Ant instead if you are running into unexpected issues.

Ex:

    cordova build android -- --ant

You can also set an environment variable to keep this preference around for a command line session.

    set ANDROID_BUILD=ant

Finally, if you are still build errors, you may want to opt to remove and re-add the android platform after switching build systems.

    cordova platform remove android
    cordova platform add android

----------

**Visual Studio 2015 RC cannot build an Android app with the Crosswalk plugin:** The Crosswalk Cordova plugin requires that Gradle be used to build Android to build but VS 2015 RC uses Ant. To build a project that uses the Crosswalk plug-in, you will need to build using the command line:

    npm install -g cordova
    cordova platform remove android
    cordova platform add android

    cordova build android

    or

    cordova run android

    or

    cordova emulate android

----------