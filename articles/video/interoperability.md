<properties
   pageTitle="Video Walkthrough: Interoperate with third-party tools | Cordova"
   description="Video Walkthrough: Interoperate with third-party tools"
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
   ms.date="09/11/2015"
   ms.author="Mikejo5000"/>

# Video Walkthrough: Interoperate with third-party tools

Apache Cordova projects that you create using many third party tools are compatible with Visual Studio 2015, including projects that you create using command line interfaces (CLIs) such as Cordova and Ionic. In this video walkthrough, we show you how to use Visual Studio 2015 with a project that you create using the Ionic CLI. This article matches the steps of the Cordova [Video tutorial](http://go.microsoft.com/fwlink/p/?LinkID=534728) on interoperability.

## Prerequisites

To follow the steps in this tutorial, you must:

1. [Install Visual Studio 2015](./getting-started/install-vs-tools-apache-cordova.md) with Visual Studio Tools for Apache Cordova.

2. [Install the Ionic CLI](http://ionicframework.com/docs/cli/install.html)

## Using a third party CLI (Ionic)

### To use Visual Studio and the Ionic CLI

1. Open a command line and switch to the folder where you will create the Ionic app using the CLI, such as Desktop.

        cd Desktop

2. Type the following command to create a new Ionic project using the Slide starter template:

        ionic start MyIonicApp slide

    Ionic creates the project. In File Explorer, you can find the new project, MyIonicApp, in the location that you created it.

    Next, we will prepare the same project so that you can open it in Visual Studio. We will do that by adding files to the project that contain metadata required by Visual Studio.

3. Open Visual Studio and create a new Apache Cordova solution using the Blank App template and name the solution **cli**.

4. Close the solution in Visual Studio.

5. From the location of the Visual Studio project, copy cli.jsproj and taco.json to the project folder for MyIonicApp.

    ![Project structure in Ionic](media/interoperability/IC795791.png)

6. In Visual Studio, locate the cli.jsproj file in the MyIonicApp folder, select it, and open it.

    Visual Studio loads the Ionic project as a Visual Studio solution.

7. In Solution Explorer, choose **Show All Files**.

    ![Project structure in Visual Studio](media/interoperability/IC795803.png)

8. In the command prompt, switch to the MyIonicApp folder.

9. Type the following command:

       ionic platform add android

    Ionic adds a platforms folder and populates the project with any other required files for Android.

    From here, you can make project changes either using Visual Studio or the Ionic CLI.
