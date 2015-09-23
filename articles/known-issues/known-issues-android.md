<properties pageTitle="Known Issues - Android" 
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#**Known Issues - Android**
This article covers known issues related to Visual Studio Tools for Apache Cordova 2015 when building or deploying to Android devices or emulators.

> **Tip**: See [Cordova 5.x.x known issues](known-issues-cordova5.md) for details on Android related issues that are specific to Cordova 5.0.0 and up.

##**Build failures after installing Android SDK Tools 24.3.2** 

When building for Android, you may encounter a build error showing a "java.io.IOException: Cannot run program" message in the Output Window after updating the "Android SDK Tools" to 24.3.2 in the Android SDK manager. This is due to [an Android SDK bug](https://code.google.com/p/android/issues/detail?id=176488) which can cause problems when building any Android app using Apache Ant (including but not limited to Cordova). If you run into problems after updating to 24.3.2 or see the stack trace shown in the [Android SDK bug](https://code.google.com/p/android/issues/detail?id=176488) in the Output Window, you will need to downgrade to a previous release of the SDK Tools (only) as follows:

1. Locate the "tools" folder for the Android SDK. (By default it is in "C:\Program Files (x86)\Android\android-sdk" or "C:\Users\\&lt;YOUR USER NAME HERE&gt;\AppData\Local\Android\android-sdk")
2. Rename the tools folder to "tools-24.3.2"
3. Download [version 24.2 of the Android SDK Tools](http://dl-ssl.google.com/android/repository/tools_r24.2-windows.zip)
4. Unzip the "tools" folder in this archive and place it in the root of your Android SDK installation

> **Note**: This issue is exclusive to the "Android SDK Tools" version and updates to "Android SDK Build-tools", "Android SDK Platform-tools", or specific SDK Platform versions such as a component of "Android 5.1.1 (API 22)" will not cause this issue.

## **Could not create the Java Virtual Machine error:** When building for Android, you may encounter a set of errors in the Errors List like the following:

~~~~~~~~~~~~~
Error		Could not create the Java Virtual Machine.			
Error		A fatal exception has occurred. Program will exit.									
Error		C:\cordova\BlankCordovaApp2\BlankCordovaApp2\platforms\android\cordova\build.bat: Command failed with exit code 1
~~~~~~~~~~~~~

The problem is that the Ant or Gradle build systems are running out of heap memory when trying to compile your application. To resolve this problem you can increase the heap of the JVM by setting the following environment variable and restarting Visual Studio:

~~~~~~~~~~~~~~~~~~~~~~
_JAVA_OPTIONS=-Xmx512M
~~~~~~~~~~~~~~~~~~~~~~

See [Tips and Workarounds](../tips-and-workarounds/android/tips-and-workarounds-android-readme.md#couldnotcreatevm) for additional details.

##**Missing Android SDK Versions** 

If you already had the Android SDK installed, you may also need to update and install the SDK for Android 4.4.2 (API level 19), Android 5.0.1 (API Level 21), or Android 5.1.1 (API Level 22) . You may need to restart Visual Studio if it is open while updating the Android SDK through the SDK Manager to be able to build for Android after the update is complete. See [Manually Installing Dependencies](https://msdn.microsoft.com/en-us/library/dn757054.aspx#ThirdParty) for details.

##**Deployment failure to Android emulator or device when switching to or from a "Release" build** 

If you encounter a failed deployment to an Andorid device or emulator with the error "**Failure [INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES]**" in the Output Window, simply delete the existing application on the device or emulator and redeploy. Debug builds will use a debug certificate while Release builds will use your configured certificate. This error is simply informing you that the certificate of the app installed on the device is different than the one you are attempting to install which can be indicator of a corrupted or otherwise modified app not safe to install on the device when it occurs in non-development (app store) scenarios.

##**Unicode Characters in Path or App Name** 

Projects with non-Western characters in their project names or in the project path may not build for Android due to an Android SDK issue on older versions of Cordova. You can workaround this by simply changing the project name and path to use western characters. In recent versions of Cordova (ex: 4.3.0), unicode characters may be used without restriction if you your system locale is set to the appropriate locale for the characters in use.
