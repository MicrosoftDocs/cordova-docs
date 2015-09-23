<properties
   pageTitle="Visual Studio Tools for Apache Cordova | Cordova"
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

# Visual Studio Tools for Apache Cordova #

You can download Visual Studio from the [Microsoft Download Center](http://go.microsoft.com/fwlink/p/?linkid=517106). With this tool, you can build cross-platform apps for iOS, Android, and Windows devices by using Visual Studio Tools for Apache Cordova. The easy-to-use installer identifies and installs the right versions of the required SDKs, tools, and libraries that you need to build [Apache Cordova](http://cordova.apache.org/) apps. Use the Visual Studio debugger to attach to iOS, Android, and Windows apps, hit breakpoints, and inspect code using the console and DOM Explorer. Apache Cordova enables cross-platform development standard web technologies such as HTML, CSS, and JavaScript.

You can build apps using the tools for these devices and platforms:

* Android 2.3.3 and later (4.4 provides the best developer experience)
* iOS 6, 7, and 8
* Windows 8 and 8.1
* Windows Phone 8 and 8.1

>**Note:**
Visual Studio Tools for Apache Cordova has been tested for use with Cordova 5.1.1 and 4.3.1\. You can select a different version using the [configuration designer](configure-vs-tools-apache-cordova.md). However, using an untested version may result in unexpected behaviors.

When you develop apps using Visual Studio Tools for Apache Cordova, Visual Studio provides these benefits:



* **Easy installation**. Manual installation of Cordova involves a lot of work to find, install, and maintain the correct version of all the third-party software required to support native platforms. Our third-party installer handles all of that for you and gets you up and running quickly.
* **Plugin management**. Cordova plugins provide access to native APIs using a JavaScript interface. Support for custom plugins like those that turn a mobile phone into a barcode scanner can help you provide rich experiences within your app. Visual Studio and IntelliSense make it easy to add and work with custom plugins and core plugins as well.
* **Unified debugging experience**. Cross-platform development often requires a different tool for debugging each device, emulator, or simulator. Different tools mean different workflows and lost productivity every time you switch devices. With Visual Studio, you can use the same world-class debugging tools for all deployment targets, including iOS devices and emulators, Android devices and emulators, Windows, and the Apache Ripple emulator.
* **Write once, deploy everywhere**. The common JavaScript and plugin APIs in Cordova make it easy to write an app using a single code base that deploys to all target platforms—iOS, Android, and Windows. Of course, you can always write platform-specific code if and when you need it.
* **Command line interoperability**. Visual Studio solutions directly reflect the file system and are updated in real time; this means that you can use any command line tool.
* **Multi-Version Cordova support**. Visual Studio solutions allow you to easily change to different versions of Cordova in your project.

## Get the tools ##

[Download Visual Studio 2015](http://aka.ms/mchm38) and select a custom installation with Cross Platform Mobile Development > HTML/JavaScript selected. You must also install the [remotebuild](https://www.npmjs.com/package/remotebuild) agent on OSX for iOS support.

For installation instructions, see [Install Visual Studio Tools for Apache Cordova](install-vs-tools-apache-cordova.md), and to get started writing your first app, see [Create Your First App Using Visual Studio Tools for Apache Cordova](create-first-app-using-vs-tools-apache-cordova.md).

## Download a sample ##

The ToDoList sample app shows how you can use different frameworks for your Cordova app. ToDoList allows users to create new tasks, check them off, and remove them. The app uses Microsoft Azure Mobile Services to store data, and also uses Bing Maps to provide valid addresses.

* [AngularJS sample](http://go.microsoft.com/fwlink/p/?LinkID=398516)
* [WinJS sample](http://go.microsoft.com/fwlink/p/?LinkID=398518)
* [Backbone sample](http://go.microsoft.com/fwlink/p/?LinkID=398517)

To download the ToDoList sample app for Visual Studio 2013, see the deprecated samples on GitHub.

>**Tip:**
To download other samples for Visual Studio Tools for Apache Cordova that demonstrate multi-page navigation and other features, see the [Ionic SideMenu starter template](http://go.microsoft.com/fwlink/p/?LinkID=544745) and [WinJS Navigation template](http://go.microsoft.com/fwlink/p/?LinkID=544743) samples.
