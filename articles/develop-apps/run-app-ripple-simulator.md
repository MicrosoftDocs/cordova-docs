<properties
   pageTitle="Run your Apache Cordova app on the Apache Ripple simulator | Cordova"
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
# Run your Apache Cordova app on the Apache Ripple simulator

The Apache Ripple simulator runs as a web app inside the Google Chrome browser. In Cordova, it can be used to simulate your app on a number of iOS and Android devices, and it provides basic support for core Cordova plugins like Geolocation and Device Orientation.

The Ripple simulator helps you quickly start validating how your apps looks and feels on iOS and Android, because both platforms use a browser with a similar code base. The Ripple simulator is particularly useful for validating layout and CSS code. For higher fidelity emulation that’s specific to a platform, use the [Android](run-app-apache.md) or [iOS](run-app-ios.md) emulators or an actual device.

>**Caution**: Ripple doesn’t provide a complete simulation of Cordova APIs or native device capabilities. It also doesn’t simulate specific browser versions for a particular platform. You can achieve this by testing on actual devices or emulators.

Here are a few things to keep in mind when testing layout using Ripple.

*   If you target Android 4.4 or later (Chromium-based browser), support for current CSS standards and other web technologies is better. See [caniuse.com](http://www.caniuse.com) for specific information on supported features.

*   If you target iOS or Android versions before 4.4, the browser is WebKit-based. (The Ripple simulator, which uses your installed version of Chrome, behaves more like Android 4.4.) Some WebKit browser behavior is different. For example, WebKit browsers don't provide consistent support for [vw and vh units](http://caniuse.com/#feat=viewport-units).

The following procedure shows you how to run your app on the simulator and attach the debugger.

### To run your app on the Ripple simulator

1.  If it is not already installed, install Chrome.

	>**Note**: Chrome is not installed by the installer for Visual Studio when you choose to install Visual Studio Tools for Apache Cordova.

2.  Choose **Android** or **iOS** from the **Solution Platforms** list.

    ![Select Android as your deployment target](media/run-app-ripple-simulator/run-ripple-platform-select.png)

	>**Note**: If you don’t see this list, choose **Solution Platforms** from the **Add/Remove Buttons** list to display it.

3.  In the list of target devices, choose one of the Ripple simulators.

    ![Selecting the Ripple emulator](media/run-app-ripple-simulator/run-ripple-device-select.png)
4.  Press F5 to start debugging, or Shift+F5 to start your app without debugging.

  >**Tip**: If you get an error that indicates you need to install a new version of the Android SDK, use the Android SDK Manager to install it. To open the SDK Manager on Windows, open a command line and type the following command: `android sdk`

Ripple avoids cross-domain limitations in the browser by using a proxy. Two proxies are available: a remote proxy and a local proxy. The remote proxy is cloud-hosted.

>**Security Note**: If your app is transferring sensitive data (for example, Active Directory authentication tokens), we strongly recommend using the local proxy instead of the remote proxy.

### To change the proxy

1.  In Chrome, while your app is running, choose the arrow button on the right, and then choose the **Settings** section.

2.  Choose the **Cross Domain Proxy** button, and then choose a proxy.

    ![Selecting a proxy in the Ripple emulator](media/run-app-ripple-simulator/run-ripple-proxy-settings.png)

You can change the target device on the fly while your app is running in Chrome. By doing this, you can avoid restarting the app in Visual Studio.

### To change the device

1.  While your app is running in Chrome, choose the arrow button on the left, and then choose the **Devices** section.

2.  Choose the button that specifies the name of the current device, and then choose a different device.

    ![Changing the device in Chrome](media/run-app-ripple-simulator/run-ripple-change-device.png)

![Download the tools](media/run-app-ripple-simulator/run-ripple-download-link.png) [Get the Visual Studio Tools for Apache Cordova](http://aka.ms/mchm38) or [learn more](https://www.visualstudio.com/cordova-vs.aspx)

#### See Also

[Install Visual Studio Tools for Apache Cordova](../getting-started/install-vs-tools-apache-cordova.md)
[Debug Your App Built with Visual Studio Tools for Apache Cordova](../debug-and-test/debug-using-visual-studio.md)
[Package Your App Built with Visual Studio Tools for Apache Cordova](../package-and-publish/package-app-built-with-visual-studio.md)
