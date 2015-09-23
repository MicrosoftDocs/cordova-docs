<properties
   pageTitle="Cordova sample app with O365 Discovery Service and the Files API | Cordova"
   description="description"
   services="na"
   documentationCenter=""
   authors="kirupa"
   tags=""/>
<tags
   ms.service="na"
   ms.devlang="javascript"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="na"
   ms.date="09/11/2015"
   ms.author="kirupa"/>
#Cordova sample app with O365 Discovery Service and the Files API

In this topic, you will learn how to leverage some of the new APIs in the client libraries for Office 365 in an app built using Visual Studio Tools for Apache Cordova.

##Office 365 API Tools for Visual Studio 2013
If you are trying to consume the Office 365 APIs for the first time in a Cordova application workflow, please follow instructions in the [documentation](./develop-apps/add-connected-services.md#Office) to [install Office 365 API Tools for Visual Studio](https://visualstudiogallery.msdn.microsoft.com/a15b85e6-69a7-4fdf-adda-a38066bb5155) and to add the service into your project.

Office 365 provides REST-based APIs that enable developers to access Office resources such as calendar, contacts, mail, files, and more. You can program directly against the REST APIs to interact with Office 365, but if you use the REST APIs you must write and maintain code around managing authentication tokens, constructing the right URLs, querying for the API you want to access, and performing other tasks. By using Office 365 client libraries to access the Office 365 APIs instead of REST, you reduce the complexity of the code that you need to write in your Cordova application.

The latest update for [Office 365 API Tools for Visual Studio](http://blogs.office.com/2014/08/05/office-365-api-tool-visual-studio-2013-summer-update/) includes support for SharePoint File services, which provides access to the MyFiles service. In addition to SharePoint services, support for the O365 Discovery service is provided which helps to find the SharePoint service endpoints for the logged in user. These services can be used to build a simple file explorer that enumerates files in OneDrive for Business.

##Building a Simple File Explorer for OneDrive for Business
The goal of this app is to enumerate files stored in OneDrive for Business. The source for the sample is on [GitHub](http://go.microsoft.com/fwlink/?LinkID=517836).

![enter image description here](media/O365_Files/Files.png)

##Getting Started
The following frameworks and libraries are used in this application:

 - [Bootstrap](http://getbootstrap.com/), for layout and styling.
 - [AngularJS](https://angularjs.org/), for binding data with the UI.
 - [Office 365 APIs](https://msdn.microsoft.com/library/office/dn605892%28v=office.15%29), for interacting with Office365 to enumerate OneDrive for Business.

The services used in the demo application to fetch files from OneDrive are:

 - [O365 Discovery Services](https://msdn.microsoft.com/library/office/dn776441%28v=office.15%29.aspx), to find SharePoint service endpoints for the logged in user.
 - [Files API](https://msdn.microsoft.com/library/office/dn605900%28v=office.15%29.aspx), to retrieve the file and folders information for the user’s OneDrive for Business.

##Creating Authentication and Discovery Contexts
Before your app can access Office 365 services, the app must be authenticated. The [common consent framework in Azure AD](https://msdn.microsoft.com/library/office/dn605895%28v=office.15%29.aspx) handles the authentication.

The basic objects that you need before you can perform any operations with O365 service are the context objects. For the demo app, the following context objects are required:

 - Authentication context
 - Discovery context

The code below constructs these objects as follows:

    var authContext = new O365Auth.Context();
    var discoveryContext = new O365Discovery.Context();

The `authContext` object allows you to fetch the required ID token and access tokens, which can be used to obtain user information and to call specific services.

The `discoveryContext` object allows you to fetch the Office 365 service capabilities, such as Mail or Calendar or MyFiles, along with their corresponding URL endpoints.

Once you have the required ID token, it can be used to identify the user. The ID token is a base64 encoded web token. You can use this token to retrieve the user that has currently logged in, as follows:

    authContext.getIdToken("https://outlook.office365.com/").then(
            (function (token) {
        // Can use token.givenName and token.familyName
    }).bind(this), function (reason) {
        console.og(reason.message);
    });

The access token is a base64 URL-encoded web token that can be used for API access. Here is how you can get the access token that is used to call SharePoint services:

    authContext.getAccessTokenFn('Microsoft.SharePoint')

##Using the Files API
The SharePoint capability object for "MyFiles" allows you to work with the files and folders programmatically. To do this, you must first obtain the capabilities collection and then look for the MyFiles capability in the returned collection. To obtain the capabilities object, use the discovery service by passing the access token for `Microsoft.SharePoint` as follows:

    var fileCapability;
    discoveryContext.services(authContext.getAccessTokenFn(
        'Microsoft.SharePoint')).then(
        (function (capabilities) {
        // We have the capabilities object.
        // Enumerate the object to get the capability
        // for "My Files"
        capabilities.forEach(function (v, i, a) {
            if (v.capability === 'MyFiles') {
                filesCapability = v;
            }
        });
    }).bind(this), function (error) {
        // error
    });

Now that you have the capability object for MyFiles, you can create a SharePoint client and then call File APIs to work with user files, such as files stored on OneDrive for Business.

##Create the SharePoint Client Object
To create the SharePoint client object we need the end point URI information stored in the capability object and the access token for the resource:

    var sharePoint = new
        Microsoft.CoreServices.SharePointClient (
        filesCapability.endpointUri,
        authContext.getAccessTokenFn(
            filesCapability.resourceId)
    );

##Fetch Files and Folders
Now we can enumerate the files by calling `getFileSystemItems()` as follows:

    sharePoint.files.getFileSystemItems().fetch().then(
        function (value) {
        value.currentPage.forEach(function (o) {
            // o._type will indicate whether this is a
            // file or folder.
            // o._Id provides the full path.
            // o._name provides the name of the file.
        });
    }, function (reason) {
        console.log(reason);
    });

In the demo application, the app fetches the information for each file and stores the information in a local JSON object. The app binds the JSON object to the UI using AngularJS.

##Give it a Try!
The complete application is available in [Github](http://go.microsoft.com/fwlink/?LinkID=517836). Please download and try the sample and let us know your feedback. We would like to hear your opinions about the new APIs!
