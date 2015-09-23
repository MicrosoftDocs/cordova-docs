<properties pageTitle="Add packages to your Cordova project with the Nuget Package Manager"
  description="This is an article on nuget tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

# Add packages to your Cordova project with the Nuget Package Manager

[NuGet](https://www.nuget.org/) is the package manager for the Microsoft development platform. It has client tools to produce and consume packages and a gallery where all the packages are hosted. In addition to popular .NET packages, it also hosts many popular JavaSript frameworks that have typically been used in ASP.NET applications. 

>**Note**: [Bower](http://www.bower.io) is now the recommended package manager to use for client-side libraries, since it is more actively maintained by JavaScript & CSS library authors and it works well across Windows, Mac OS X, and Linux platforms. To learn more about Bower, see our tutorial [Using the Bower package manager in Cordova projects](./tutorial-using-bower.md).

Cordova projects created in Visual Studio can also use NuGet to add JavaScript references, just like in any other web project. Most NuGet scripts may be downloaded to a `Scripts` folder by default, depending on the package's configuration. To enable these scripts to work in Cordova, they must be packaged as part of the final app, and they need to be moved to the `www` folder. While this file copy can be done manually, Cordova's [Hooks](http://cordova.apache.org/docs/en/edge/guide_appdev_hooks_index.md.html) are a great way to automate this step in the developer workflow. Hooks represent special scripts that can be added by plugins, or by the project itself, to run custom commands at various stages of the Cordova build process.

To define a hook in your project, you declare the command in the `config.xml` file, and you also declare the step when it should run.
To copy the resources over to the `www` folder, we could simpy write a hook in our app to run before Cordova starts anything; this is done using the `before_prepare` step:

1. open `config.xml` in the code view and add the following line anywhere under root `<widget>` element

    ```XML
    <hook type="before_prepare" src="hooks/copyNuGetFiles.js" />
    ```

2. As mentioned in the statement above, create a folder called `hooks` under the project and a new file in it called `copyNuGetFiles.js`.
3. Cordova hooks can be Node modules or shell scripts. Node modules are much more powerful because they are passed a context object describing the environment in which the scripts are running. Add the following to the `copyNuGetFiles.js` file to define a Node module for the hook

    ```JavaScript
    // Contents of copyNuGetFiles.js
    var path = require('path');
    module.exports = function (context) {
      var shell = context.requireCordovaModule('shelljs');
      var src = path.join(context.opts.projectRoot, 'Scripts');
      var dest = path.join(context.opts.projectRoot, 'www/lib')
      shell.cp('-fr', src, dest);
    };

    ```

    The hook itself is pretty straight forward. It first uses a module called [shelljs](https://www.npmjs.com/package/shelljs) that is already used in Cordova. It uses this module to copy the source from the Scripts folder used by NuGet.

    > Note that the file locations used may change, depending on the NuGet package and your project structure. You may have to modify the source accordingly.

    After defining the destination, we simply use the `shelljs` module to perform the actual copy into a `www/lib` folder. Now you may refer to the JavaScript files in their new location in your `www/index.html` file!
