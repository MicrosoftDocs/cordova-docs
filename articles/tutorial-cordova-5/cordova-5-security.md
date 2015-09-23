<properties pageTitle="An introduction to Cordova 5 security"
  description="This is an article on ionic tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#An introduction to Cordova 5 security

**Note: If the default blank template in Visual Studio 2015 is does not default to 5.1.1, you should update Tools for Apache Cordova.** Some very early adopters may not see some of the improvments described in this document until after you update. You will soon see a notification in the in the  notification center (flag in the upper right) prompting you to update.

One of the more confusing changes about [Apache Cordova 5](http://go.microsoft.com/fwlink/?LinkID=617659) is that the updated version of the Android platform (also called Cordova Android 4.x) and iOS now follow a different, but more powerful security model designed to provide developers with the tools needed to prevent cross-site scripting attacks among other issues. A critical aspect of this security model is that **absolutely no network access of any kind is allowed without the installation of a Cordova plugin**.

##Cordova Whitelists
The new [Cordova Whitelist plugin (cordova-plugin-whitelist)](http://go.microsoft.com/fwlink/?LinkID=617668) is the recommended base security plugin to use for managing network security access. Historically there was one **access** element in config.xml used to control all access to network resources. For example, adding the following to config.xml resulted in the app not only being able to make XHR calls, access images, or reference remote scripts but also allowed Cordova to navigate to any URI.

~~~~~~~~~~~~~~~~~~~~~~~
<access origin="*" />
~~~~~~~~~~~~~~~~~~~~~~~

The problem with this model is you may want to be able to make an XHR to a service like Azure Mobile Services without actually allowing your app to navigate to an Azure web page in the same domain. The reason this is a concern is that this remote web page is then given access to all Cordova and plugin APIs. Further, for Android, the access element has been overloaded to control "intents" in the wake of a discovered [security issue in Cordova 3.5.0 and below](http://go.microsoft.com/fwlink/?LinkID=617669) which has led to a syntax that strayed away from the original [W3C Widget spec](http://go.microsoft.com/fwlink/?LinkID=617670) that config.xml's structure is based on. Some restructuring and improvements were therefore appropriate for the Cordova 5.0.0 release.

###cordova-plugin-whitelist
As a result, the new whitelist plugin actually introduces three separate elements designed to enable more discrete control. The **access** element returns but only controls where your app can make XHR requests or access other external content from a web page for Android and iOS. It no longer controls whether you can navigate to a different domain. A new **allow-navigation** element has been added that then enables you to specify where the app can navigate instead. Finally, a new **allow-intent** element has been introduced specifically designed to control Android intents.

The base [Cordova CLI](http://aka.ms/cordova-cli) template (via the cordova create command) has a config.xml file in it that is designed to allow the app to make external requests anywhere, allows a specific subset of intents, and prevents the WebView in the Cordova app to navigate anywhere other than local content.

~~~~~~~~~~~~~~~~~~~~~~~
<access origin="*" />
<allow-intent href="http://*/*" />
<allow-intent href="https://*/*" />
<allow-intent href="tel:*" />
<allow-intent href="sms:*" />
<allow-intent href="mailto:*" />
<allow-intent href="geo:*" />
~~~~~~~~~~~~~~~~~~~~~~~

If we wanted to add the ability for the root WebView to navigate to www.microsoft.com, we can add this XML element:

~~~~~~~~~~~~~~~~~~~~~~~
<allow-navigation href="http://www.microsoft.com" />
~~~~~~~~~~~~~~~~~~~~~~~

Note that if you simply wanted to display www.microsoft.com without giving it access to Cordova or plugin APIs, you can use the **[InAppBrowser plugin](http://go.microsoft.com/fwlink/?LinkID=617694)** without adding the allow-navigation element to your config.xml file.

There is still some variation in behavior by platform for these whitelist features based on the concerns and capabilities of the underlying native technology.

1. **Android** supports the use of access, allow-navigation, and allow-intent. Intents are an Android specific concept.
2. **iOS** supports the use of access and allow-navigation.
3. **Windows 10** via the Windows platform supports the allow-navigation element exactly like iOS and Android. The access element is also supported but behaves a bit differently in that navigation is allowed to these URIs but Cordova and plugin APIs are disabled thereby reducing risk. In Windows 10, XHR, CSS, and image access rules are intended to be controlled by a Content Security Policy (CSP) via connect-src rather than specific whitelists. We'll cover more details on how to use CSPs later in this document.
4. **Windows 8.0, 8.1, and Windows Phone 8.1** via the Windows platform does not support navigating to external URIs outside of the InAppBrowser plugin due to fundamental platform limitations. XHR calls are always allowed to any domain.
5. The **Windows Phone 8 (WP8)** platform still uses the old definition of the access element and does not support allow-navigation or allow-intent.

Note that if you would prefer to retain the old behavior of the access element for Android and iOS, you can install [cordova-plugin-legacy-whitelist](http://go.microsoft.com/fwlink/?LinkID=617695) though this is intended only to be used for backwards compatibility and new apps should generally move towards using cordova-plugin-whitelist.

###Automatically Adding the Plugin
A new feature in Cordova 5.0.0+ allows you specify plugins in config.xml that are then automatically added at build time. This capability can be used with any Cordova plugin and is conceptually similar to the Visual Studio specific "vs:plugin" element. We worked with the community to get it added into the core and over time we will discontinue the use of the "vs" prefix but we have left the feature in place for backwards compatibility (as Cordova 4.3.1 does not have this feature). Near term most VS documentation will recommend the use of "vs:plugin" instead.

Cordova 5.0.0+:

~~~~~~~~~~~~~~~~~~~~~~~
<plugin name="cordova-plugin-whitelist" version="1.0.0" />
~~~~~~~~~~~~~~~~~~~~~~~

VS syntax (works with any Cordova version):

~~~~~~~~~~~~~~~~~~~~~~~
<vs:plugin name="cordova-plugin-whitelist" version="1.0.0" />
~~~~~~~~~~~~~~~~~~~~~~~

Both the default Cordova CLI template and Visual Studio's blank template use this feature to install the Whitelist plugin automatically on first build.

##The W3C Content Security Policy (CSP)
A topic of frequent conversation for security focused developers on the web is the [W3C Content Security Policy (CSP)](http://go.microsoft.com/fwlink/?LinkID=617696) feature that is available in Chrome, Safari, and Internet Explorer Edge. CSP support is available natively to Cordova apps targeting iOS, Windows 10 and up, and Android 4.4 and up. However, you can get support back to Android 4.0 by using something called the Crosswalk WebView. See [Using Apache Cordova 5](./tutorial-cordova-5-readme.md#crosswalk) for information adding Crosswalk to your project.

###The CSP in Cordova 5
CSP support is a native browser capability that allows you to control exactly what content your app can access and at a very granular level. In fact, when using the CSP, you can generally keep the access origin to "*" as you'll be able to more tightly control security using the policy.

A CSP is applied at a page level through a few different mechanisms, but for Cordova apps you typically use a meta tag. Here is the CSP policy on index.html in the default Cordova CLI project template:

~~~~~~~~~~~~~~~~~~~~~~~
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
~~~~~~~~~~~~~~~~~~~~~~~

You will need to include a tag like this on each page you navigate to at the top level (a navigation that results in a different window.location.href). With "Single Page Apps", you generally will only need to put it on index.html, but it's worth noting that you can apply completely different security rules based on your situation by modifying this policy. For example, if you have a page that is collecting sensitive data, you may wish to strongly lock down access while keeping things more open on other pages.

The only problem with the CSP is this: It's pretty confusing to read at first and its defaults can cause some behaviors web devs are not at all used to working around.

You can find a [great tutorial on using the CSP in detail here](http://go.microsoft.com/fwlink/?LinkID=617697), but here are some common "gotchas" for those new to the concepts:

1. By default, applying a CSP **disables both eval() and inline script** while the CSP in the **Cordova CLI template (cordova create command) disables inline but allows eval()**.
	- Disabling both eval and inline script means no script tags with JavaScript in it, no "on" event handler attributes on HTML elements, no eval(), no new Function(), etc. Disabling these features effectively makes it impossible to do cross-site scripting because there is no way to inject JavaScript anywhere that does not originate from a file. If you're property managing your whitelists, you're very secure.

	- The problem is that disabling eval() in particular can break quite a few web frameworks.

	- As a result, the CSP in the base Cordova CLI template specifies **unsafe-eval** for **default-src** which enables JavaScript code to use eval and similar dynamic script techniques. Ex:

		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~

	- If your app and your frameworks don't need eval, remove the unsafe-eval declaration.

	- If you really need inline script, you can add the 'unsafe-inline' declaration. Of the two, inline script is actually a higher risk than eval since something as simple as using innerHTML without proper filtering can allow a hacker to add inline script. Inline script is very common, but if your app is security focused, you should avoid it. Note that the 'unsafe-inline' declaration in the Cordova CLI template applies to style-src which enables inline CSS declarations not JavaScript.

1. The default CSP policy in the Cordova CLI template only allows access to JavaScript and CSS files inside the app or the same domain, not a different domain. **As a result, CDN hosted content typically cannot be referenced.**

	- This is another technique to reduce risk by stating that a given web page can only reference content from **'self'**. The end result is that cross-site scripting vulnerabilities are further reduced by preventing your web page from being hijacked to include content from an external, untrusted sources.

	- You can loosen this restriction by listing other trusted domains. In fact, the default Cordova CLI template lists "https://ssl.gstatic.com" as a trusted domain since Android needs it for TalkBack to function properly.

		~~~~~~~~~~~~~~~~~~~~~~~
		default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval';
		~~~~~~~~~~~~~~~~~~~~~~~

	This above CSP policy says that content originating from the same domain ('self'), data URIs (data:), Cordova internal APIs (gap:), https://ssl.gstatic.com, and eval statments are allowed, but all others are denied.

##Migrating an Existing Project
When you upgrade a project to Cordova 5.0.0+ from Cordova 4.3.1 or below in Visual Studio, you will want to take the following steps to ensure your app functions as you would expect.

1. Add the whitelist plugin to your project via config.xml:

	1. Double click on config.xml in your project

	2. Click on the "Plugins" tab

	2. Select "Whitelist" and click "Add"

		![Add Whitelist Plugin](media/cordova-5-security/cordova-5-7.png)

2. Update config.xml with allow-intent or allow-navigation elements as needed:

	1. Right-click on config.xml and select "View Code" if you have not already

	2. Add the following XML elements under the &lt;widget&gt; element:

		~~~~~~~~~~~~~~~~~~~~~~~
		<allow-intent href="http://*/*" />
		<allow-intent href="https://*/*" />
		<allow-intent href="tel:*" />
		<allow-intent href="sms:*" />
		<allow-intent href="mailto:*" />
		<allow-intent href="geo:*" />
		~~~~~~~~~~~~~~~~~~~~~~~

		You should already have an &lt;access&gt; element in your config.xml. You can use the "Domain Access" list under the "Common" tab in the config.xml designer to add or edit your current list.

	3. Optionally, if your app is using hosted content, or you'd prefer not to restrict where the WebView can navigate during development, you can also add the following elements:

		~~~~~~~~~~~~~~~~~~~~~~~
		<allow-navigation href="http://*/*" />
		<allow-navigation href="https://*/*" />
		<allow-navigation href="data:*" />
		~~~~~~~~~~~~~~~~~~~~~~~

		However, we strongly recommend narrowing down your access before releasing your app as many app stores will not accept apps that are completely open without filing for an exception and having a very good reason to do so.

3. Due to the significant security benefits associated with using a CSP, we strongly recommend taking the Cordova CLI template's CSP metatag and add it to the header of any page the app will navigate to in your app. Note that **you can use add a CSP meta tag to hosted content too.**

	~~~~~~~~~~~~~~~~~~~~~~~
	<head>
	    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
	    <link rel="stylesheet" type="text/css" href="css/index.css">
	    <title>My Super Cool Cordova App</title>
	</head>
	~~~~~~~~~~~~~~~~~~~~~~~

	Start with the most locked down security policy you can and back away as needed. That way you'll ensure you're using the most secure practices you can from the start.

	To reiterate, **CSP support is only available on Android 4.4+ devices or Android 4.0+ when using Crosswalk.** See [Using Apache Cordova 5](./tutorial-cordova-5-readme.md#crosswalk) for information adding Crosswalk to your project.

## More Information
* [Read more about Apache Cordova 5](./tutorial-cordova-5-readme.md)
* [Read tutorials and learn about tips, tricks, and known issues](./cordova-docs-readme.md)
* [Download samples from our Cordova Samples repository](http://github.com/Microsoft/cordova-samples)
* [Follow us on Twitter](https://twitter.com/VSCordovaTools)
* [Visit our site http://aka.ms/cordova](http://aka.ms/cordova)
* [Ask for help on StackOverflow](http://stackoverflow.com/questions/tagged/visual-studio-cordova)
* [Email us your questions](mailto:/vscordovatools@microsoft.com)
 