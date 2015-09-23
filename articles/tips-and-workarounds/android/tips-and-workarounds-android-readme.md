<properties pageTitle="Android tips and workarounds"
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#Android tips and workarounds
This document covers tips, tricks, and known workarounds for problems with the Cordova Android platform.
> **Note**: If your problem is security related, please read [May 26th, 2015 Android Security Issue](../tutorial-cordova-5-readme/)

<a name="couldnotcreatevm"></a>
##Could Not Create Java Virtual Machine Error
When building for Android, you may encounter a set of errors in the Errors List like the following:

~~~~~~~~~~~~~
Error		Could not create the Java Virtual Machine.			
Error		A fatal exception has occurred. Program will exit.									
Error		C:\cordova\BlankCordovaApp2\BlankCordovaApp2\platforms\android\cordova\build.bat: Command failed with exit code 1
~~~~~~~~~~~~~

The problem is that the Ant or Gradle build systems are running out of heap memory when trying to compile your application. To resolve this problem you can increase the heap of the JVM by setting the following environment variable and restarting Visual Studio:

~~~~~~~~~~~~~~~~~~~~~~
_JAVA_OPTIONS=-Xmx512M
~~~~~~~~~~~~~~~~~~~~~~

More specifically, following the instructions from [this article](http://www.tomsguide.com/faq/id-1761312/fix-create-java-virtual-machine-issue.html):

1. Open the Control Panel
2. Go to System
3. Go to Advanced Systems Properties
4. Go to Environment Variables
5. In System Variables, click Add
6. New Variable Name: _JAVA_OPTIONS
7. New Variable Value: -Xmx512M
8. Click OK
9. Now restart Visual Studio to ensure the variable is picked up

If this does not resolve the issue, you can upgrade to a 64-bit version of the JDK [from here](http://download.oracle.com/otn-pub/java/jdk/7u79-b15/jdk-7u79-windows-x64.exe) and update the JAVA_HOME environment variable to the new install location.

## More Information
* [Read tutorials and learn about tips, tricks, and known issues](../../cordova-docs-readme.md)
