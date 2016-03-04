<properties pageTitle="Known Issues - Android"
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="kirupa" />
  <tags
     ms.service="na"
     ms.devlang="javascript"
     ms.topic="article"
     ms.tgt_pltfrm="mobile-multiple"
     ms.workload="na"
     ms.date="09/10/2015"
     ms.author="kirupac"/>

#**Known Issues - Android**
This article covers known issues related to Visual Studio Tools for Apache Cordova 2015 when building or deploying to Android devices or emulators.

> **Tip**: See [Cordova 5.x.x known issues](known-issues-cordova5.md) for details on Android related issues that are specific to Cordova 5.0.0 and up.

##**Plugin installs fail with a message stating Cordova Android 5.0.0 or higher is required**
Android Marshmallow introduced new security features that have resulted in breaking changes to Cordova itself and by extension core plugins including:

- cordova-plugin-camera
- cordova-plugin-geolocation
- cordova-plugin-contacts
- cordova-plugin-file
- cordova-plugin-media

As a result, in general we recommend moving to Cordova 6.0.0 or higher when targeting Android. Installing any of these plugins with an earlier version may result in a message telling you that Cordova Android 5.0.0 or higher is required. Switching to Cordova 6.0.0 will resolve this problem.

If you need to stay on an earlier version of Cordova, you may need to install an earlier version of the plugin from the command line as follows from your project directory:

```
npm install -g cordova@5.4.1
cordova plugin add cordova-plugin-camera@^1.2.0
```

...replacing the Cordova version and camera plugin Id with the appropriate one for your use case.

##**Apps crash in emulators and/or the VS debugger does not attach when using the Crosswalk plugin**
1. If you run into a problem where the Visual Studio **debugger is not attaching** after adding the Crosswalk plugin, you may be encountering an issue with a recent version of Crosswalk.  Crosswalk version 15 is known to work well and you can force this version to be used with a simple preference. Simply add the following to config.xml by right-clicking on the in file in Visual Studio and selecting **View Code**:

	```
	<preference name="xwalkVersion" value="org.xwalk:xwalk_core_library:15+" />
	```


2. If you are using the **Visual Studio Android Emulator** and encounter an **app crash** on startup, you may be experiencing an incompatibility with a specific version of Crosswalk being added to your project by the plugin and the emulator. Crosswalk version 15 is known to work well and you can force this version to be used with a simple preference. See #1 for details.

4. If you encounter a "Could not create the Java Virtual Machine" error, add the following environment variable to your system and restart VS to bump up Java's heap memory to at least 512M:

	```
	_JAVA_OPTIONS=-Xmx512M
	```

5. Finally, if you are using the standard **Google Android Emulator,** and encounter an **app crash** after adding the Crosswalk plugin, be sure to the **Use Host CPU** option is checked in the AVD that you create, and have up-to-date graphics drivers installed on your system, or the app will crash due to Crosswalk's support of WebGL.


##**Build failures after installing Android SDK Tools 24.3.2**

When building for Android, you may encounter a build error message, "java.io.IOException: Cannot run program", in the Output Window after updating the "Android SDK Tools" to 24.3.2 in the Android SDK manager. This is due to [an Android SDK bug](https://code.google.com/p/android/issues/detail?id=176488) that can cause problems when building any Android app using Apache Ant (including but not limited to Cordova). If you run into problems after updating to 24.3.2 or see the stack trace shown in the [Android SDK bug](https://code.google.com/p/android/issues/detail?id=176488) in the Output Window, you will need to downgrade to a previous release of the SDK Tools (only) as follows:

1. Locate the "tools" folder for the Android SDK. (By default it is in "C:\Program Files (x86)\Android\android-sdk" or "C:\Users\\&lt;YOUR USER NAME HERE&gt;\AppData\Local\Android\android-sdk")
2. Rename the tools folder to "tools-24.3.2"
3. Download [version 24.2 of the Android SDK Tools](http://dl-ssl.google.com/android/repository/tools_r24.2-windows.zip)
4. Unzip the "tools" folder in this archive and place it in the root of your Android SDK installation

> **Note**: This issue is exclusive to the "Android SDK Tools" version. Updates to "Android SDK Build-tools", "Android SDK Platform-tools", or specific SDK Platform versions such as a component of "Android 5.1.1 (API 22)" will not cause this issue.

## **Could not create the Java Virtual Machine error:** When building for Android, you may encounter a set of errors in the Errors List like the following:

~~~~~~~~~~~~~
Error		Could not create the Java Virtual Machine.			
Error		A fatal exception has occurred. Program will exit.									
Error		C:\cordova\BlankCordovaApp2\BlankCordovaApp2\platforms\android\cordova\build.bat: Command failed with exit code 1
~~~~~~~~~~~~~

The problem is that the Ant or Gradle build systems are running out of heap memory when trying to compile your app. To resolve this problem, you can increase the heap of the JVM by setting the following environment variable and restarting Visual Studio:

~~~~~~~~~~~~~~~~~~~~~~
_JAVA_OPTIONS=-Xmx512M
~~~~~~~~~~~~~~~~~~~~~~

See [Tips and Workarounds](../tips-and-workarounds/android/tips-and-workarounds-android-readme.md#couldnotcreatevm) for additional details.

##**Missing Android SDK Versions**

If you already had the Android SDK installed, you may also need to update and install the SDK for Android 4.4.2 (API level 19), Android 5.0.1 (API Level 21), or Android 5.1.1 (API Level 22). If Visual Studio is open while updating the Android SDK through the SDK Manager, you may need to restart it after the update to to build for Android successfully. See [Manually Installing Dependencies](https://msdn.microsoft.com/en-us/library/dn757054.aspx#ThirdParty) for details.

##**Deployment failure to Android emulator or device when switching to or from a "Release" build**

If you encounter a failed deployment to an Andorid device or emulator with the error "**Failure [INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES]**" in the Output Window, simply delete the existing app on the device or emulator and redeploy. Debug builds will use a debug certificate while Release builds will use your configured certificate. This error is simply letting you know that the certificate of the app installed on the device is different than the one you are attempting to install. In non-development (app store) scenarios, this can be indicator of a corrupted or otherwise modified app not safe to install on the device.

##**Unicode Characters in Path or App Name**

Projects with non-Western characters in their project names or in the project path may not build for Android due to an Android SDK issue on older versions of Cordova. You can work around this by simply changing the project name and path to use western characters. In recent versions of Cordova (ex: 4.3.0), Unicode characters may be used without restriction if your system locale is set to the appropriate locale for the characters in use.
