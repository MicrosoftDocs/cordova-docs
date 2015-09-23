<properties pageTitle="Bower Tutorial" 
  description="This is an article on bower tutorial" 
  services="" 
  documentationCenter=""
  authors="bursteg" />

#May 26th, 2015 Android Cordova Platform Security Issue
Recently [Trend Micro uncovered a security flaw](http://blog.trendmicro.com/trendlabs-security-intelligence/trend-micro-discovers-apache-vulnerability-that-allows-one-click-modification-of-android-apps/) in the Cordova Android “platform” that affects all versions of Cordova. As a result the [Cordova community has taken swift action to resolve the issue by releasing a patched version of the platform](http://cordova.apache.org/announcements/2015/05/26/android-402.html). While it is difficult to know if a given app has been compromised by this issue, it is a broad risk and therefore we recommend all app developers update their projects to use the patched versions of the Cordova Android platform.

While we are working with the community on a “tools release” for the Apache Cordova Command Line Interface (CLI) to update the default version of the Android platform to include this patch, you can immediately update your project to the patched version of the Cordova Android platform when using Cordova 4.3.0 or 5.0.0 with Tools for Apache Cordova 2015 RC or later. 

Developers using the Cordova CLI without Visual Studio can [follow the steps covered in this Apache blog post on the issue](http://cordova.apache.org/announcements/2015/05/26/android-402.html). However, we recommend also adding the &lt;engine&gt; element to your config.xml file as described below to prevent you from accidently going back to the unpatched version of the Android platform (particularly if you do not check in the platforms folder to source control).

We recommend all users of VS 2013 CTPs or earlier VS 2015 CTPs upgrade to VS 2015 RC or later so that they can take advantage of features described in this article to mitigate the security issue.

##Updating Your Project

First, you need to add one XML element into config.xml in your project.

1. In Visual Studio, right click on config.xml and select “View Code”
2. When using the default version of Cordova 4.3.0, add the following under the root \<widget\> element in config.xml:

    ~~~~~~~~~~~~~~~~~~~~~~~
    <engine name="android" version="3.7.2" />
    ~~~~~~~~~~~~~~~~~~~~~~~~

    …or if you opted to update to Cordova 5.0.0:

    ~~~~~~~~~~~~~~~~~~~~~~~~
	<engine name="android" spec="4.0.2" />
    ~~~~~~~~~~~~~~~~~~~~~~~~

For projects where you have **already executed a build for Android on your system**, you’ll also need to remove the old version of the Cordova Android platform. Follow these steps:

1.	Open a command prompt and go to your Cordova project root (not the solution root). 

2.	Type the following commands:

	~~~~~~~~~~~~~~~~~~~~~~~~
	npm install -g cordova
	cordova platform remove android
	cordova platform add android
	~~~~~~~~~~~~~~~~~~~~~~~~

The next time you build you will now be on the patched version of the Android platform.

To make this simple, [you can find an updated version of the config.xml file in the VS template  here](https://github.com/Microsoft/cordova-docs/tree/master/tips-and-workarounds/android/security-05-26-2015) along with a batch file that will remove the old version of the Android platform when executed from your project folder.

##Long Term

An upcoming “tools release” of the Apache Cordova CLI will use the patched version of the Cordova Android platform by default. We will be updating the default templates in Visual Studio Tools for Apache Cordova to use this updated version of Cordova for new projects, but it is also worth noting that we’ve made changes as of Visual Studio 2015 RC to make updating the Cordova version in existing projects simple as well. To do so, follow these steps:

1.	Double click on config.xml in your project
2.	Click the “Platforms” tab
3.	Enter the updated version of the Cordova CLI

From this point forward you will be on the updated version of Cordova, the underlying Cordova CLI, and its associated platforms.

Further updates on the upcoming Apache Cordova CLI "tools release" can be found in the "News" section of the [Apache Cordova site](http://cordova.apache.org).  
