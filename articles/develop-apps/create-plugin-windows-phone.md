<properties
   pageTitle="Create a Cordova plugin for Windows and Windows Phone | Cordova"
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
# Create a Cordova plugin for Windows and Windows Phone

A Cordova plugin is a cross-platform library that accesses native code and device capabilities through a JavaScript interface. When required, the plugin also updates the platform manifest to enable device capabilities. In this tutorial, you will create a Cordova plugin for Windows Phone, **ToUpperPlugin**, add it to a Cordova app, and call the plugin method from the app. The plugin has one method, **ToUpper**, that converts a string to uppercase. The plugin supports both Windows Phone 8 and Windows Phone (Universal). The Windows Phone 8 plugin uses C# and the Windows Phone (Universal) plugin uses JavaScript.

The tutorial assumes you have some familiarity with Cordova plugins. For an introduction to plugins, see <span>[Manage Plugins for Apps Built with Visual Studio Tools for Apache Cordova](manage-plugins.md)</span> and [Apache Cordova Overview](http://cordova.apache.org/docs/en/4.0.0/guide_overview_index.md.html#Overview).

The tutorial assumes you have some familiarity with Cordova plugins. For an introduction to plugins, see [Manage Plugins for Apps Built with Visual Studio Tools for Apache Cordova](https://msdn.microsoft.com/en-us/library/dn757051.aspx) and [Apache Cordova Overview](http://cordova.apache.org/docs/en/4.0.0/guide_overview_index.md.html#Overview).


The early sections of the tutorial take you straight through the process with little detail. The later sections explain the code in more detail and will help you create, configure, debug, and deploy your own plugins.

The [Windows Phone Plugin Generator](http://download.microsoft.com/download/5/B/4/5B433693-63A4-4509-A6F5-17A892A7D59E/PluginSourceAndApp.zip) download includes the code for this tutorial and an app that generates a simple plugin.

##<a id="CreateCordova"></a>Create the Cordova plugin

The **ToUpperPlugin** plugin needs four files.

*   A native C# file that contains the plugin methods for Windows Phone 8\.

*   A native JavaScript file that contains the plugin methods for Windows Phone (Universal).

*   A JavaScript file that calls **cordova.exec**. This file is the bridge between the JavaScript code in your app and the native code in your plugin.

*   An XML file that describes your plugin, defines the supported platforms, and specifies the locations of the C# file and the JavaScript file.

### Create folders

You start by creating the following folder and file structure. While this is not the only folder structure you can use, it is the structure that many plugins follow. The folder structure looks like this:

![The file structure of a plugin.](media/create-plugin-windows-phone/create-plugin-folder-structure.png)

1.  Create a root folder for your plugin and name it **ToUpperPlugin**.

2.  In the **ToUpperPlugin** folder, create a folder named **src**.

3.  In the **src** folder, create a folder named **wp**.

4.  In the **src** folder, create a folder named **windows**.

5.  In the **ToUpperPlugin** folder, create a folder named **www**wp** folder, add an empty C# class file, **ToUpperPlugin.cs**.

4.  In the **windows** folder, add an empty JavaScript file, **ToUpperPluginProxy.js**.

7.  In the **www** folder, add an empty JavaScript file, **ToUpperPlugin.js**.

10.  In the **ToUpperPlugin** folder, add an empty xml file, **plugin.xml**.

    You now have the files you need for the plugin:

  *   **ToUpperPlugin\plugin.xml**

  *   **ToUpperPlugin\src\wp\ToUpperPlugin.cs**

  *   **ToUpperPlugin\src\windows\ToUpperPluginProxy.cs**

  *   **ToUpperPlugin\www\ToUpperPlugin.js**

### Add the plugin method for Windows Phone 8

The native code for the Windows 8 platform is written in C#. Add the following code to the **ToUpperPlugin.cs** file:

```c#
using System;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class ToUpperPlugin : BaseCommand
    {
        public void ToUpper(string options)
        {
            string upperCase = JSON.JsonHelper.Deserialize<string[]>(options)[0].ToUpper();
            PluginResult result;
            if (upperCase != "")
            {
                result = new PluginResult(PluginResult.Status.OK, upperCase);
            } else
            {
                result = new PluginResult(PluginResult.Status.ERROR, upperCase);
            }

            DispatchCommandResult(result);
        }
    }
}

```

The code in the **ToUpperPlugin.cs** is discussed in more detail in the [Creating a plugin method for Windows Phone 8](#CreatingMethod) section later in this tutorial.

### Add the plugin method for Windows Phone (Universal)

The native code for Windows Phone (Universal) is written in JavaScript. Add the following code to the **ToUpperPluginProxy.js** file:

```javascript
//  JavaScript
var cordova = require('cordova'),
    ToUpperPlugin= require('./ToUpperPlugin');

module.exports = {

    ToUpper: function (successCallback, errorCallback, strInput) {

        var upperCase = strInput[0].toUpperCase();
        if(upperCase != "") {
            successCallback(upperCase);
        }
        else {
            errorCallback(upperCase);
        }
    }
};
require("cordova/exec/proxy").add("ToUpperPlugin", module.exports);
```

The code in this JavaScript file is discussed in more detail in the [Creating a plugin method for Windows Phone (Universal)](#CreatingMethod) section later in this tutorial

### Add code to the plugin.xml file

Add the following code to the **plugin.xml** file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
      id="com.contoso.ToUpperPlugin"
      version="0.1.0">
    <name>ToUpperPlugin</name>
    <description>ToUpper plugin for Apache Cordova</description>
    <license>MIT</license>
    <keywords></keywords>
    <repo></repo>
    <issue></issue>

    <js-module src="www/ToUpperPlugin.js" name="ToUpperPlugin">
        <clobbers target="ToUpperPlugin" />
    </js-module>

    <!-- wp8 -->
    <platform name="wp8">
        <config-file target="config.xml" parent="/*">
            <feature name="ToUpperPlugin">
                <param name="wp-package" value="ToUpperPlugin"/>
            </feature>
        </config-file>

        <source-file src="src/wp/ToUpperPlugin.cs" />
    </platform>

    <!-- windows -->
    <platform name="windows">
        <js-module src="src/windows/ToUpperPluginProxy.js" name="ToUpperPluginProxy">
            <merges target="" />
        </js-module>
    </platform>

</plugin>
```

The code in the **plugin.xml** file is discussed in more detail in the [Configuring the plugin.xml file](#ConfiguringXML) section later in this tutorial.

### Add code to the JavaScript plugin interface file

Add the following code to the **ToUpperPlugin.js** file:

```javascript
// JavaScript
var ToUpperPlugin = {
    ToUpper: function (successCallback, errorCallback, strInput) {
        cordova.exec(successCallback, errorCallback, "ToUpperPlugin", "ToUpper", [strInput]);
    }
}

module.exports = ToUpperPlugin;
```

The code in **ToUpperPlugin.js** is discussed in more detail in the [Creating the JavaScipt plugin interface file](#CreatingInterface) section later in this tutorial.

Your plugin is complete and ready to add to a project.

## <a id="AddPlugin"></a>Add the plugin to the Cordova project

1.  Create a new Cordova project.

2.  Right-click **config.xml** in **Solution Explorer** and select **View Designer**.

6.  Select the **Plugins** tab.

8.  Select the **Custom** heading.

10.  Select **Local**.

12.  Browse to the top of the plugin folder structure.

13.  Click **Add**.

    Visual Studio adds the plugin to your project and creates the folder structure shown in the following image:

    ![Project structure of a plugin in a Cordova app.](media/create-plugin-windows-phone/create-plugin-updated-folder-structure.png)
15.  Save the project.

16.  To run the app on Windows 8, choose the **Windows Phone 8** platform and the **Emulator WVGA 512MB**, as shown in the following image.

    ![Selecting WP emulator from the toolbar.](media/create-plugin-windows-phone/create-plugin-run-app.png)
19.  Press F5 to run your project and verify that it runs the Windows Phone emulator without error as shown in the following image.

    ![The app running in a Windows Phone Emulator.](media/create-plugin-windows-phone/create-plugin-run-app-emulator.png)
20.  To run the app on Windows 8 (Universal), choose the **Windows Phone (Universal)** platform and the **Emulator 8.1 WVGA 4 inch 512MB**.

23.  Press F5 to run your project and verify that it runs on the Windows Phone emulator.

Now that you have added the plugin to the project, you are ready to call the **ToUpper** method from your code.

   >**Note** You cannot debug the Windows Phone Cordova project. There are a couple of options for debugging the app. The first is to use the platform-specific project as described in the section [Developing and debugging the plugin code](#DebugPlugin) later in this tutorial. Another option is to use [Web Inspector Remote](http://msopentech.com/blog/2013/05/31/now-on-ie-and-firefox-debug-your-mobile-html5-page-remotely-with-weinre-web-inspector-remote/).


## <a id="CallPlugin"></a>Call the plugin from your app

Open **index.html** and add this code before the closing tag **</body>**.

```html
Input text: <input type="text" id="inputText" style="font-size: xx-large" /><br/>
<button type="button" style="font-size: xx-large" onclick="toUpperClicked()">To Upper</button>
<p id="toUpperResult"></p>

<script>

var successCallback = function () {
        document.getElementById("toUpperResult").innerText =
        'ToUpperPlugin successCallback ' + arguments[0];
};

var errorCallback = function (arguments) {
    document.getElementById("toUpperResult").innerText =
        'ToUpperPlugin errorCallback ' + arguments[0];
};

function toUpperClicked(arguments) {
    ToUpperPlugin.ToUpper(successCallback, errorCallback,
        document.getElementById("inputText").value);
}

</script>
```

The code you added to **index.html** is discussed in more detail in the[Calling Plugin Methods from Your App](#CallingPlugins) section later in the tutorial

## <a id="RunTheApp"></a>Run the app with your plugin

1.  Press F5 to run your project, as shown in the following image:

    ![The app with input box and button.](media/create-plugin-windows-phone/create-plugin-run-app-emulator-2.png)
2.  Verify that the app returns a successful result if you enter text in the input box and returns an error result if the input box is empty.

You now have a complete plugin and a project that uses the plugin. The following sections describe the files in more detail.

## <a id="CreatingMethod"></a>Creating a plugin method for Windows Phone 8

This section discusses the C# plugin method in more detail. Here’s the code you used for your plugin:

```C#
// C#
using System;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class ToUpperPlugin : BaseCommand
    {
        public void ToUpper(string options)
        {
            string upperCase = JSON.JsonHelper.Deserialize<string[]>(options)[0].ToUpper();
            PluginResult result;
            if (upperCase != "")
            {
                result = new PluginResult(PluginResult.Status.OK, upperCase);
            } else
            {
                result = new PluginResult(PluginResult.Status.ERROR, upperCase);
            }

            DispatchCommandResult(result);
        }
    }
}
```

There are a few key elements that you have to get right so that you can call your plugin method and so that you can get results from your plugin method.

*   **Namespace.** Your plugin class must exist in the **WPCordovaClassLib.Cordova.Commands** namespace. That namespace, which is added by Visual Studio to the Windows Phone version of the app, contains the **BaseCommand** class that you must derive from.

*   **Base class.** You can name your plugin class whatever you like, but it must derive from **BaseCommand**. The **BaseCommand** class is created by Visual Studio and added to the Windows Phone project. You can find the class in the **cordovalib** folder of the Windows Phone project. It’s in the **WPCordovaClassLib.Cordova.Commands** namespace. The location is shown in the following image.

    ![The location of BaseCommand in the project.](media/create-plugin-windows-phone/create-plugin-basecommand-location.png)
*   **Signature.** Your method must use this signature:

	```C#
	// C#
	public void MethodName(string options)
	```

	 You can change **MethodName** and **options** to something more meaningful for your app, but the rest must stay the same. The arguments that are passed to the method are converted into a JSON object. You need to parse the JSON to retrieve the arguments. For example, in **ToUpperPlugin**, the string is passed as the first item in an array that is converted to JSON. Visual Studio includes a JSON visualizer to view the contents of a JSON package. To display the visualizer, in debug mode, mouse over the variable containing JSON. From the context menu, select JSON visualizer, as shown in the following image. For information on how to debug the Windows Phone project, see the section [Developing and debugging the C# plugin code](#DebugPlugin) later in this tutorial.

    ![How to select the JSON visualizer.](media/create-plugin-windows-phone/create-plugin-json-viz-select.png)
    ![The JSON visualizer.](media/create-plugin-windows-phone/create-plugin-json-viz.png)
*   **PluginResult.** If you want to return something from your method to your app, or if you want to trigger either a success callback method or an error callback method in your app, you need to create and dispatch a `PluginResult` object. In the constructor for `PluginResult`, you indicate whether the method succeeded or not, and you include the value to be passed back to your app. The code follows this pattern:

	```C#
	// C#
	PluginResult result = new PluginResult(PluginResult.Status.OK, upperCase);
	DispatchCommandResult(result);
	```


## <a id="CreatingUniversal"></a>Creating a plugin method for Windows Phone 8 (Universal)

This section discusses the JavaScript plugin method in more detail. Here’s the code you used for your plugin:

```javascript
//  JavaScript
var cordova = require('cordova'),
    ToUpperPlugin= require('./ToUpperPlugin');

module.exports = {

    ToUpper: function (successCallback, errorCallback, strInput) {

        var upperCase = strInput[0].toUpperCase();
        if(upperCase != "") {
            successCallback(upperCase);
        }
        else {
            errorCallback(upperCase);
        }
    }
};
require("cordova/exec/proxy").add("ToUpperPlugin", module.exports);
```

There are a few key elements that you have to get right so that you can call your plugin method and so that you can get results from your plugin method.

*   **Exports**. The `module.exports` and `require` statements make the `ToUpper` function available outside the source file as part of the plugin.

*   **Signature.** Your method must use this signature:

	```javascript
	// JavaScript
	MethodName: function (successCallback, errorCallback, args)
	```

	    You can change method name and parameter names to something more meaningful for your app. The `args` parameter is an array.

*   **Callback functions**. If you want to return something from your method to your app, you can use the `sucessCallback` and `errorCallback` methods.


## <a id="ConfiguringXML"></a>Configuring the plugin.xml file

This section discusses the **plugin.xml** file in more detail. Here’s the plugin.xml file that you created.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
      id="com.contoso.ToUpperPlugin"
      version="0.1.0">
    <name>ToUpperPlugin</name>
    <description>ToUpper plugin for Apache Cordova</description>
    <license>MIT</license>
    <keywords></keywords>
    <repo></repo>
    <issue></issue>

    <js-module src="www/ToUpperPlugin.js" name="ToUpperPlugin">
        <clobbers target="ToUpperPlugin" />
    </js-module>

    <!-- wp8 -->
    <platform name="wp8">
        <config-file target="config.xml" parent="/*">
            <feature name="ToUpperPlugin">
                <param name="wp-package" value="ToUpperPlugin"/>
            </feature>
        </config-file>

        <source-file src="src/wp/ToUpperPlugin.cs" />
    </platform>

    <!-- windows -->
    <platform name="windows">
        <js-module src="src/windows/ToUpperPluginProxy.js" name="ToUpperPluginProxy">
            <merges target="" />
        </js-module>
    </platform>

</plugin>
```

The XML contains the minimum elements you need to get your plugin working. There are a few key elements that you have to get right so Visual Studio and Cordova can find your plugin files and call your plugin methods.

*   **<plugin>** The `id` attribute that you add to the `<plugin>` element is used to by Visual Studio to create a project folder with the plugin files. It is the name of your plugin and it is carried over into the project’s `config.xml` file. Here is how it appears in `plugin.xml`, part of the plugin:

	```
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
      id="com.contoso.ToUpperPlugin"
      version="0.1.0">
      ```
This is how it appears in `config.xml`, part of the Cordova project:

	`<vs:plugin name="com.contoso.toupperplugin" version="0.1.0" />`

*   **<js-module>** The **<js-module>** element specifies the location and filename of your plugin interface file, in this case `ToUpperPlugin.js`. The interface file specifies the JavaScript signatures of your plugin methods and makes the all-important call to `cordova.exec`. The `<clobbers>` element specifies the plugin name that you will use in your code that calls the plugin. The `src` attribute specifies the name of the file and its location relative to the `plugin.xml` file.

	```
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
      id="com.contoso.ToUpperPlugin"
      version="0.1.0">
      ```
*   **<platform name="wp8">** The `<platform>` element specifies the location and filename of the native code file, in this case `ToUpperPlugin.cs`. The `name` attribute is limited to a set of names that are supported by Cordova. In this case, `"wp8"` is used for Windows Phone 8\. The `<config-file>` element contains plugin information that is added to the `config.xml` file of the Cordova project. It makes the Windows Phone project aware of the plugin source. The `<source-file>` element specifies the location and filename of the code file.

	```
    <platform name="wp8">
        <config-file target="config.xml" parent="/*">
            <feature name="ToUpperPlugin">
                <param name="wp-package" value="ToUpperPlugin"/>
            </feature>
        </config-file>
        <source-file src="src/wp/ToUpperPlugin.cs" />
    </platform>
    ```
*   **<platform name="windows">** This element specifies the location and filename of the native code file for the Windows Phone (Universal) platform. The `<js-module>` element specifies the location and filename of the code file.

	```
    <platform name="windows">
        <js-module src="src/windows/ToUpperPluginProxy.js" name="ToUpperPluginProxy">
            <merges target="" />
        </js-module>
    </platform>
    ```


## <a id="CreatingInterface"></a>Creating the JavaScript plugin interface file

This section describes the JavaScript interface file in more detail. Here’s the **toupperplugin.js** file that you created.

```javascript
// JavaScript
var ToUpperPlugin = {
    ToUpper: function (successCallback, errorCallback, strInput) {
        cordova.exec(successCallback, errorCallback, "ToUpperPlugin", "ToUpper", [strInput]);
    }
}

module.exports = ToUpperPlugin;
```

There are a few key elements that you have to get right so Visual Studio and Cordova can find your plugin files and call your plugin methods.

*   **ToUpper.** The function specifies how you call the function from your Cordova app. In this case you have three arguments, two callback functions and one string. The arguments passed to the native code vary by platform. For example, the call to the `ToUpper` method in the **ToUpperPluginProxy.js** file receives all three arguments while the call to `ToUpperPlugin.cs` receives only one argument.

*   **cordova.exec.** The call to `cordova.exec` has four required parameters. The first two are the success and error callback functions. The third is the name of the service (or plugin). The fourth is the name of the method. In Cordova, this is called the action. Any remaining arguments are passed as an array to the plugin method.

*   **module.exports.** The last line of code makes the `ToUpper` function available to the rest of the project.

## <a id="CallingPlugins"></a>Calling plugin methods from your app

This section describes the code in **index.html** in more detail. Here’s the code you added that calls the plugin method, **ToUpper**.

```html
Input text: <input type="text" id="inputText" style="font-size: xx-large" /><br/>
<button type="button" style="font-size: xx-large" onclick="toUpperClicked()">To Upper</button>
<p id="toUpperResult"></p>

<script>

var successCallback = function (arguments) {
        document.getElementById("toUpperResult").innerText =
        'ToUpperPlugin successCallback ' + arguments[0];
};

var errorCallback = function (arguments) {
    document.getElementById("toUpperResult").innerText =
        'ToUpperPlugin errorCallback ' + arguments[0];
};

function toUpperClicked() {
    ToUpperPlugin.ToUpper(successCallback, errorCallback,
        document.getElementById("inputText").value);
}

</script>
```

The call to `ToUpper` method takes three parameters, a callback function for success, a callback function for error, and the string you want to convert to uppercase. The callback functions extract the uppercase string, contained in `arguments`, and display them in the `toUpperResult` paragraph element. The `ToUpper` method is called from the `ToUpperPlugin` module.

## <a id="RemovePlugin"></a>How to remove a local plugin from your app

The Visual Studio designer for config.xml that removes plugins does not remove local plugins. To delete your plugin:

1.  Delete the folder from the project.

2.  Delete the `vs:plugin` element in the config.xml file.

## <a id="DebugPlugin"></a>Developing and debugging the plugin code

When you ran your Cordova project, Visual Studio created a Windows Phone projects in the **platforms\wp8** and **platforms\windows** folders of your project folder. The projects are recreated every time you build or clean your Cordova project.

You can copy the projects to a new location and use them to develop your plugin. When you have your plugin working, you need to copy the final code back to the plugin location you created at the beginning of the tutorial.

> **Caution** Visual Studio will update or delete the projects every time you build your Cordova app. You need to copy the projects to a new location to prevent Visual Studio from overwriting them.

##<a="Troubleshooting"></a>Troubleshooting**](javascript:void(0) "Collapse")<div class="LW_CollapsibleArea_HrDiv">

These are some of the issues that might happen as you create and use your plugin.

### The plugin does not load into the Cordova project

There might be a problem with the names of the files and folders as compared to the files and folders listed in plugin.xml.

### The plugin does not load into the platform-specific project.

There might be problem in how you defined the `<platform>` element of **plugin.xml**. There is a limited set of valid platform names. The plugin might load into the Cordova project, but at build time, the plugin files will not be added to the platform-specific projects.

### The call to the plugin fails silently.

The plugin name or the method name you used in the code does not match the plugin you created.

### It just doesn't work!

Check the following items:

*   Make sure the casing on every instance of the plugin name and the method name is consistent across all the files, including both the filenames and the text inside the files. While there is some leeway in casing as you cross boundaries within and between JavaScript and C#, be consistent and you won't have to troubleshoot casing issues.

*   Make sure the folders and files are named exactly as specified in the **plugin.xml** file. A single typo can invalidate an entire plugin.

*   Carefully check any text substitutions for spelling errors you've made along the way.

*   Scale back to a minimal plugin and get that working. Then add more pieces.

*   Watch the Output window closely while the project is building. Some messages appear only briefly during the build process.


## <a id="NextSteps"></a>Next Steps

This tutorial created a very basic plugin. From here you could add any number of customizations.

*   You can share your plugin on the [Apache Cordova Plugins Registry](http://plugins.cordova.io/#/). The registry is also an excellent source of plugin samples.

*   You can add more methods to your plugin.

*   You can add more source files to your plugin. In this tutorial, you had one method in one source file. As your plugin becomes more complex, you can distribute code across source files as the architecture dictates.

*   You can support more or fewer platforms. To learn more about developing plugins for other platforms, see the [Plugin Development Guide](http://cordova.apache.org/docs/en/4.0.0/guide_hybrid_plugins_index.md.html#Plugin%20Development%20Guide).

![Download the tools](media/create-plugin-windows-phone/create-plugin-download-link.png) [Get the Visual Studio Tools for Apache Cordova](http://aka.ms/mchm38) or [learn more](https://www.visualstudio.com/cordova-vs.aspx

## See Also

[Windows Phone Plugin Generator](http://download.microsoft.com/download/5/B/4/5B433693-63A4-4509-A6F5-17A892A7D59E/PluginSourceAndApp.zip)
[Plugin Development Guide (Apache Cordova Documentation)](http://cordova.apache.org/docs/en/4.0.0/guide_hybrid_plugins_index.md.html#Plugin%20Development%20Guide)
