<properties pageTitle="Ionic Tutorial" 
  description="This is an article on ionic tutorial" 
  services="" 
  documentationCenter=""
  authors="bursteg" />

#Cordova Hook to Execute VS Task Runner Explorer Bindings from the Command Line

License: MIT

Use this hook if you want to be able to use the "Before Build" and "After Build" event bindings **outside** of Visual Studio (say from the Cordova CLI itself or during a CI build). It wires in the "Before Build" binding in the Task Runner Explorer to "Before Prepare" in Cordova and "After Build" in the Task Runner Explorer to "After Compile" in Cordova. **Note that currently this hook only supports bindings in gulpfile.js in the root of your project.**

To install it:

1. Grab the js file and drop it a "hooks" folder in your project root
2. Update config.xml with the following:

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  <hook type="before_prepare" src="hooks/hook-task-runner-binding.js" />
  <hook type="after_prepare" src="hooks/hook-task-runner-binding.js" />
  <hook type="before_compile" src="hooks/hook-task-runner-binding.js" />
  <hook type="after_compile" src="hooks/hook-task-runner-binding.js" />
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

##Using the Visual Studio 2015 Task Runner Explorer
The Visual Studio Task Runner Explorer allows users to tie Gulp tasks to specific build events. To use the Task Runner Explorer:

1. Go to View > Other Windows > Task Runner Explorer
2. You will now see any gulpfiles you have in your project. (Hit the refresh icon if you added one after opening the window.)
3. To bind a task to an event, right click on the task, go to Bindings, and select the event you want

**Note: The hook currently only works if "gulpfile.js" is in the root of the project. In addition, Clean and ProjectOpened do not have direct analogs in the Cordova CLI and are currently ignored.**

This results in a comment being added to gulpfile.js with the bindings.  Ex:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// <binding BeforeBuild='before-build-gulp-task' AfterBuild='after-build-gulp-task' Clean='after-build-gulp-task' ProjectOpened='before-build-gulp-task' />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The config.xml elements above will map the BeforeBuild task into the Cordova CLI before\_prepare event and the AfterBuild task to the Cordova CLI after\_compile event.  These same events are fired by the cordova "build" command which combines "prepare" and "compile" in one comand while still allowing each of these commands to function separatley.

While not supported via Visual Studio UI, you can wire in Gulp tasks to additiona Cordova hooks by simply using the hook name using the syntax above. Ex:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// <binding after_prepare='after-prepare-gulp-task' />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The hook also automatically detects if Gulp is not installed in the node_modules folder in your project and will "npm install" the contents of package.json in your project to further streamline development.

## Terms of Use
By downloading and running this project, you agree to the license terms of the third party application software, Microsoft products, and components to be installed. 

The third party software and products are provided to you by third parties. You are responsible for reading and accepting the relevant license terms for all software that will be installed. Microsoft grants you no rights to third party software.


## License
Unless otherwise mentioned, the code samples are released under the MIT license.

```
The MIT License (MIT)

Copyright (c) Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

