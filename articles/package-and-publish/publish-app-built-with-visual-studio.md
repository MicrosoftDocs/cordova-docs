<properties
   pageTitle="Publish your app built with Visual Studio Tools for Apache Cordova | Cordova"
   description="description"
   services="na"
   documentationCenter=""
   authors="Mikejo5000"
   tags=""/>
<tags
   ms.service="na"
   ms.devlang="javascript"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="na"
   ms.date="09/10/2015"
   ms.author="mikejo"/>
# Publish your app built with Visual Studio Tools for Apache Cordova

To publish your app built using Visual Studio Tools for Apache Cordova, you can access the packages you build in the bin folder in the Visual Studio project directory. For more information about building packages, see [Package Your App Built with Visual Studio Tools for Apache Cordova](package-app-built-with-visual-studio.md).

> **Tip**: For information on how to create packaging assets for Windows, iOS, and Android, see this [github documentation](./tutorial-package-publish/tutorial-package-publish-readme.md).

Instructions for uploading your app to the public app store vary by platform:

*   For Google Play, see the [instructions](https://support.google.com/googleplay/android-developer/answer/113469?hl=en) on the Android Developer website.

*   For iOS, use the Application Loader to submit your app to the App Store. To do this, follow the instructions in the [Using Application Loader](https://itunesconnect.apple.com/docs/UsingApplicationLoader.pdf) PDF file.

*   For Windows, see [Using the Windows Store Dashboard](https://msdn.microsoft.com/library/windows/apps/hh967767.aspx) in the Windows Dev Center.

*   For Windows Phone, see [Submit your app](https://msdn.microsoft.com/library/windowsphone/help/jj206724.aspx) in the Windows Dev Center.

Although the process of uploading your app to a public store varies by store type and platform, [Windows Intune](https://www.microsoft.com/server-cloud/products/windows-intune/default.aspx#fbid=Zjhx4IFbY3b) provides an excellent cross-platform internal app store for Android, iOS, Windows, and Windows Phone. You can upload your app to Windows Intune by using [Microsoft System Center](https://www.microsoft.com/server-cloud/products/system-center-2012-r2/default.aspx#fbid=Zjhx4IFbY3b) and the Windows Intune management console, shown here.

![Using InTune to create an internal app store](media/publish-app-built-with-visual-studio/publish-intune.png)

Follow the steps described in [Deploy software to mobile devices in Windows Intune](https://technet.microsoft.com/library/dn646972.aspx) to publish a software installer for each device type (Android, iOS, Windows Phone, and Windows).

For your convenience, the `vs-mda-remote` agent also creates a Wireless Manifest plist file. You can use this file to upload your iOS app to Windows Intune. The plist file can be found in the bin folder with your IPA (.ipa) file after you build your app in Visual Studio. You can also modify this file manually.

![Download the tools](media/publish-app-built-with-visual-studio/publish-download-link.png) [Get the Visual Studio Tools for Apache Cordova](http://aka.ms/mchm38) or [learn more](https://www.visualstudio.com/cordova-vs.aspx)
