<properties pageTitle="Bower Tutorial" 
  description="This is an article on bower tutorial" 
  services="" 
  documentationCenter=""
  authors="bursteg" />#Workaround for Missing Execute Bit for Builds on OSX After Checking in Platforms Folder from Windows

License: MIT

If you are seeing errors that are originating from files in your project's "platforms" folder when building either Android or iOS on OSX, the root cause may be that you checked in shell scripts under the "platforms/android/cordova", "platforms/ios/cordova", "platforms/windows/cordova", or "platforms/wp8/cordova" folders from Windows. This is because the NTFS file system has no concept of an "execute bit" that is required to run these from OSX. (The contents of the platforms is generally not intended for checked in and by default are excluded from Cordova projects in Visual Studio as a result.)

For example, this error is saying the "version" script is not executable:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[17:41:57] Error:
/Users/vsoagent/vsoagent/agent/work/build/b424d56537be4854de825289f019285698609afddf826d5d1a185eb60b806e47/repo/tfs-vnext test/platforms/android/cordova/version:
Command failed with exit code EACCES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To resolve this problem you have two options:

1.  Don't check in or copy the contents of the "platforms" folders. This is by far the path of least resistance.

2.  If you absolutely must check in the contents of the platforms folder from Windows, you can craft a simple script to set the execute bits on these files and include it as a part of your build process.
	1. Download the hook-execute-bit-fix.js file and drop it in a "hooks" folder in your project root.
    
	2. Update config.xml with the following (using Right-Click > View Code):

	  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	  <hook type="before_plugin_add" src="hooks/hook-execute-bit-fix.js" />
	  <hook type="after_platform_add" src="hooks/hook-execute-bit-fix.js" />
	  <hook type="before_prepare" src="hooks/hook-execute-bit-fix.js" />
	  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
	
	2. Commit / check these into source control.
    
	3. Next time you build / run / add a plugin, the problem should be resolved.
	
You could also opt to encapsulate this functionality inside a Cordova plugin by placing the same XML elements above in plugin.xml.  Finally, there is also a simple set-execute.sh script from the command line that can be used instead.

