<properties pageTitle="Build your first Cordova plugin"
  description="Build your first Cordova plugin"
  services=""
  documentationCenter=""
  authors="bursteg" />

# Build your first Cordova plugin

### Step 1: Determine what you want your plugin to do ###
Cordova plugins are appropriate in two main cases:

- There is a need to expose the native capabilities of a device to a Cordova app
- There is a need to encapsulate common functionality across a number of Cordova apps, even if that functionality does not require interaction with the native platform.

In this tutorial, we will focus on the first type of plugin. We will demonstrate the steps needed to create a plugin that accesses a user's calendar to determine if they are about to be late for a meeting. To do this, we will use the native Calendar APIs present on Android&trade;, iOS&trade;, and Windows Phone &reg;.

### Step 2: Create the plugin skeleton ###
Before generating the skeleton for your plugin, you should decide on the plugin's ID and name. In particular, the ID should be unique, and should follow the convention "cordova-plugin-[your-plugin-name]".

For the purpose of this tutorial, we will go through the process of creating a plugin that uses a device's native services to determine if a user has an appointment within the next X minutes. The plugin ID will be "cordova-plugin-am-i-late", and the name will be "Am I Late?".

Now that we've decided on what our plugin will do and what it will be called, we're ready to create the skeleton. While this can be done by hand, the **plugman** will generate the necessary folder structure and file for you. To install plugman, run **npm install plugman** from a command prompt.

To create the skeleton, call plugman as follows:

    plugman create --name AmILate --plugin_id cordova-plugin-am-i-late --plugin_version 0.0.1

If the command succeeds, you should see no additional output to the command prompt. plugman should have created a folder structure that looks like this:

    AmILate/
    |- plugin.xml
    |- src/
    \- www/
       \- AmILate.js

At this point, you are ready to move onto the next step.

### Step 3: Design the JS interface ###

TEXTGOESHERE

### Step 4: Implement the native functionality ###

Now that the JS interface has been defined, it's time to start writing the code that will execute on the individual native platforms. Each platform has a slightly different way of interacting with plugins, but we will cover Android, iOS, and Windows Phone in this tutorial.

For each platform, you will add a folder under the **src** folder, as well as some entries in **plugin.xml**. Once again, plugman simplifies this process considerably.

#### Android&trade; ####
To start, we will add the android platform:

    plugman platform add --platform_name android

When the command completes, your folder structure should now look like this:

    AmILate/
    |- plugin.xml
    |- src/
	|  \- android/
    |     \- AmILate.java
    \- www/
       \- AmILate.js

As well, plugin.xml will include these new lines:

	<platform name="android">
		<config-file parent="/*" target="res/xml/config.xml">
			<feature name="AmILate">
				<param name="android-package" value="cordova-plugin-am-i-late.AmILate" />
			</feature>
		</config-file>
		<config-file parent="/*" target="AndroidManifest.xml"></config-file>
		<source-file src="src/android/AmILate.java" target-dir="src/cordova-plugin-am-i-late/AmILate" />
	</platform>

Mobile platforms often require that apps request permission from the user in order to access particular features. Part of creating a plugin is ensuring that any such permissions are specified by the plugin. For our plugin, we will need to include the "Read Calendar" permission from Android. To do so, we will add the middle line to plugin.xml:


    <config-file parent="/*" target="AndroidManifest.xml">
        <uses-permission android:name="android.permission.READ_CALENDAR"/>
    </config-file>

While our plugin will only need the single java source file, it is simple to add additional native files to the plugin by adding <source-file/> elements to plugin.xml.

To actually implement the native functionality, we will add the necessary Java code. Looking at the generated AmILate.java, you will see a number of references to "coolMethod". Those should be replaced with getNextAppointment. As well, the argument is an integer, not a string, so that call should be changed. After updating the scaffolding, the relevant methods should look like this:

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getNextAppointment")) {
            int minutes = args.getInt(0);
            this.getNextAppointment(minutes, callbackContext);
            return true;
        }
        return false;
    }

    private void getNextAppointment(int minutes, CallbackContext callbackContext) {
        if (minutes > 0) {
            callbackContext.success("Plugin is working");
        } else {
            callbackContext.error("minutes must be > 0");
        }
    }

Before continuing, let's look at some important features of the code:

- The *action* parameter is used to distinguish between different method calls that users may make to your plugin.
- The execute() method should return true if your plugin handles a particular action, and false otherwise. Note that this does indicate the success or failure of the handling.
- Indicating success is failure is done by calling the appropriate method on the callbackContext. While our code only passes back a message for now, you can also pass a JSONObject or JSONArray if you need to return structured data.

Knowing that, we're finally ready to implement the calendar functionality. The specific code needed to access the calendar is beyond the scope of this article, but the plugin plumbing code is still important. The method will look like this when completed:

    private void getNextAppointment(int minutes, CallbackContext callbackContext) {
        if (minutes > 0) {
			/**
				Code to retrieve name, time of next appointment goes here
			**/
			if (foundAppointment) {
				JSONObject returnObject = new JSONObject();
				returnObject.put("title", appointmentTitle);
				returnObject.put("date", appointmentDate);
				callbackContext.success(returnObject);
			} else {
				// If no appointment was found, return an empty string.
				// Note that we used success() rather than error(), since
				// no finding an appointment is perfectly valid. Error
				// conditions should be reserved for situations where
				// the plugin was unable to complete its task at all.
				callbackContext.success("");
			}
        } else {
            callbackContext.error("minutes must be > 0");
        }
    }

At this point, the plugin is ready to be consumed by a Cordova app.

#### iOS&trade; ####

Adding the ios platform can also be done via plugman:

    plugman platform add --platform_name ios

When the command completes, your folder structure should now look like this:

    AmILate/
    |- plugin.xml
    |- src/
	|  |- android/
    |  |  \- AmILate.java
    |  \- ios/
    |     \- AmILate.m
    \- www/
       \- AmILate.js

As well, plugin.xml will include these new lines:

	<platform name="ios">
        <config-file parent="/*" target="config.xml">
            <feature name="AmILate">
                <param name="ios-package" value="AmILate" />
            </feature>
        </config-file>
        <source-file src="src/ios/AmILate.m" />
    </platform>

Adding more source files to our plugin simply requires adding <source-file/> elements under the ios platform element in plugin.xml. Header files can be added in the same way using <header-file/> elements.

The final AmILate.m implementation, which illustrates the key plugin plumbing code, will look like this:

	- (void)getNextAppointment:(CDVInvokedUrlCommand*)command
	{
	    CDVPluginResult* pluginResult = nil;
	    int minutes = [[command.arguments objectAtIndex:0] intValue];

	    if (minutes > 0) {
			/**
				Code to retrieve name, time of next appointment goes here
			**/
			if (foundAppointment) {
				NSMutableDictionary *appointment = [NSMutableDictionary dictionaryWithCapacity:2];
				[appointment setObject:appointmentName forKey:@"title"];
				[appointment setObject:appointmentDate forKey:@"date"];
		        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:appointment];
			} else {
				pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
			}
	    } else {
			// Indicate an error result
	        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
	    }

	    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}

Rather than using JSONObject/JSONArray, iOS allows plugins to return structured data by passing back an NSMutableDictionary. However, the basic structure is very similar to the android platform.

#### Windows Phone ####

The native code for Windows and Windows Phone 8.1+ is slightly different from other platforms. While it is possible to implement the functionality using C# or C++, the native APIs are actually available via JavaScript, and it is usually easiest that way.

Unfortunately, plugman does not currently support the windows platform, so the scaffolding previously created by plugman needs to be done by hand.

First, create a windows folder under the src folder, and then create an empty AmILate.js in it. Your folder structure should now look like this:

    AmILate/
    |- plugin.xml
    |- src/
	|  |- android/
    |  |  \- AmILate.java
	|  |- ios/
    |  |  \- AmILate.m
	|  \- windows/
    |     \- AmILate.js
    \- www/
       \- AmILate.js

Then add the following lines to plugin.xml, just below the closing </platform> tag for android:

    <platform name="windows">
        <js-module src="src/windows/AmILate.js" name="AmILate">
            <runs target="" />
        </js-module>
    </platform>

Next, add the following code to src/windows/AmILate.js:

    module.exports.getNextAppointment = function(success, error, args) {
		if (args.length == 0 || args[0] < 0) {
			// Invalid call to the plugin, so return an error condition
			error('Invalid value for minutes argument');
			return;
		}

		/**
			Code to retrieve name, time of next appointment goes here
		**/

		if (foundAppointment) {
			result = {
					'title': appointmentTitle,
					'date' : appointmentDate
					};
			success(result);
		} else {
			// Empty string to indicate no appointment
			success('');
		}
    }

Note how much simpler this was than the Java implementation. The callback methods are invoked directly, the json objects can be constructed in-place, and the arguments parameters can be accessed with sensible syntax, rather than complex method calls.

### Step 5: Test the plugin ###



### Step 6 (optional): Publish the plugin to NPM ###

Starting with Cordova version 5.0.0, plugins are published to and retrieved from NPM. This greatly simplifies the steps required to publish your plugin for use by others. Once your plugin is in a stable state, these steps will package and upload it to NPM.

First, use plugman to generate a package.json for your plugin:

    plugman createpackagejson .

Answer the questions presented, and you will end up with a package.json that looks like this:

	{
	  "name": "AmILate",
	  "version": "0.0.1",
	  "description": "A plugin for determining if the user has an appointment coming up shortly",
	  "cordova": {
	    "id": "cordova-plugin-am-i-late",
	    "platforms": [
	      "android",
	      "ios",
		  "windows"
	    ]
	  },
	  "keywords": [
	    "ecosystem:cordova",
	    "cordova-android",
	    "cordova-ios",
		"cordova-windows"
	  ],
	  "author": "Microsoft",
	  "license": "ISC"
	}

If everything looks right, you are ready to publish! Just run the following command from a command prompt:

    npm publish .
