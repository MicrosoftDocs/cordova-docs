<properties
   pageTitle="Application Lifecycle Management (ALM) with Apache Cordova Apps | Cordova"
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

# Application Lifecycle Management (ALM) with Apache Cordova Apps

Developing apps for modern platforms involves many more activities than just writing code. DevOps (development + operations) recognizes a variety of activities across an app’s complete lifecycle. These include agile planning and tracking work, designing and implementing code, managing a source code repository, running builds, managing continuous integrations and deployments, testing (including unit tests and UI tests), running various forms of diagnostics in both development and production environments, and monitoring app performance and user behaviors in real time through telemetry and analytics.

Visual Studio, Visual Studio Online, and Team Foundation Server provide a variety of DevOps capabilities (also referred to as application lifecycle management or ALM), a number of which are applicable to Cordova apps. Tools that are designed for .NET languages like C#, however, do not apply to JavaScript code. Other tools require tight integration with build and runtime environments. Because Cordova apps on Windows run as native apps, you’re able to use a variety of Visual Studio’s diagnostic tools such as performance profilers that are not available on non-Windows platforms.

The table below identifies which Visual Studio ALM features you can expect to work well with an Apache Cordova project, and which ones have limitations. Refer to the linked documentation for details on the features themselves.

<style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
    th, td {
        padding: 5px;
    }
</style>
<table>
              <tbody><tr>
                <th>
                  <p>Area</p>
                </th>
                <th>
                  <p>Feature</p>
                </th>
                <th>
                  <p>Supported with Apache Cordova</p>
                </th>
                <th>
                  <p>Comments</p>
                </th>
              </tr>
              <tr>
                <td rowspan="5">
                  <p>
                    <strong>
                      <span>
                        <a href="https://msdn.microsoft.com/en-us/library/dd286619.aspx">Track work using Visual Studio Online or Team Foundation Server</a>
                      </span>
                    </strong> (using TFS or Visual Studio Online, including Team Explorer Everywhere)</p>
                </td>
                <td>
                  <p>Manage backlogs and sprints</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td rowspan="5">
                  <p>All planning and tracking features are independent of project type and coding languages.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Work tracking </p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Team room collaboration</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Kanban boards</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Report and visualize progress</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="8">
                  <p>
                    <strong>
                      <span>
                        <a href="https://msdn.microsoft.com/en-us/library/57b85fsc.aspx">Analyze and model your architecture</a>
                      </span>
                    </strong>
                  </p>
                </td>
                <td>
                  <p>Sequence diagrams</p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td rowspan="8">
                  <p>Most design features rely on .NET and languages like C# and do not work with HTML, CSS, and JavaScript. See <span><a href="https://msdn.microsoft.com/en-us/library/ff183189.aspx#modelingdiagramstools">Modeling Diagram Tools</a></span> for what aspects are related to code.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Dependency graphs</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Call hierarchy</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Class designer</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Architecture explorer</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>UML diagrams (use case, activity, class, component, sequence, and DSL)</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Layer diagrams</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Layer validation</p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="5">
                  <p>
                    <strong>Code</strong>
                  </p>
                </td>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/ms181237.aspx">Use Team Foundation Version Control</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/hh850437.aspx">Use Visual Studio with Git</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Code analysis (references, suggested changes, etc.)</p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td>
                  <p>One exception is the Go To Definition command that works with JavaScript.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/dn269218.aspx">Find code changes and other history with CodeLens</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td>
                  <p>Not supported for JavaScript.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/jj739835.aspx">Use code maps to debug your applications</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td>
                  <p>Not supported for JavaScript.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="5">
                  <p>
                    <strong>
                      <span>
                        <a href="https://msdn.microsoft.com/en-us/library/ms181709.aspx">Build the application</a>
                      </span>
                    </strong>
                  </p>
                </td>
                <td>
                  <p>On-premises TFS server</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>Build machines must have Apache Cordova installed; an OSX machine can also be a build server for iOS. See <a href="https://github.com/Microsoft/cordova-docs/blob/master/tutorial-team-build/TFS2015.md">Using Tools for Apache Cordova Apps with Visual Studio Online and Team Foundation Services 2015</a> (Github) or <a href="http://go.microsoft.com/fwlink/?LinkID=533770" target="_blank">Using Tools for Apache Cordova with Team Foundation Services 2013</a> (GitHub).</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>On-premises build server linked to Visual Studio Online</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>See <a href="https://github.com/Microsoft/cordova-docs/blob/master/tutorial-team-build/TFS2015.md">Using Tools for Apache Cordova Apps with Visual Studio Online and Team Foundation Services 2015</a> (Github) for instructions.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Hosted controller service of Visual Studio Online</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>See <a href="https://github.com/Microsoft/cordova-docs/blob/master/tutorial-team-build/TFS2015.md">Using Tools for Apache Cordova Apps with Visual Studio Online and Team Foundation Services 2015</a> (Github). Also see <a href="http://listofsoftwareontfshostedbuildserver.azurewebsites.net/">http://listofsoftwareontfshostedbuildserver.azurewebsites.net/</a> for the list of software installed on the hosted controller.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>On-premises Jenkins CI or other build server</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>See <a href="http://go.microsoft.com/fwlink/?LinkID=613703" target="_blank">Using Tools for Apache Cordova with the Jenkins CI System</a> (GitHub), <a href="http://go.microsoft.com/fwlink/?LinkID=533742" target="_blank">Using Gulp to Build Cordova Projects</a> (GitHub), or <a href="https://github.com/Microsoft/cordova-docs/tree/master/tutorial-team-build">Building Cordova Apps in a Team/Continuous Integration Environment</a> (GitHub) for instructions.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Build definitions with pre- and post-scripts</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Continuous integration including gated check-ins</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>See <a href="https://github.com/Microsoft/cordova-docs/blob/master/tutorial-team-build/TFS2015.md">Using Tools for Apache Cordova Apps with Visual Studio Online and Team Foundation Services 2015</a> (GitHub), <a href="http://go.microsoft.com/fwlink/?LinkID=533770" target="_blank">Using Tools for Apache Cordova with Team Foundation Services 2013</a> (GitHub), <a href="http://go.microsoft.com/fwlink/?LinkID=613703" target="_blank">Using Tools for Apache Cordova with the Jenkins CI System</a> (GitHub), or <a href="https://github.com/Microsoft/cordova-docs/tree/master/tutorial-team-build">Building Cordova Apps in a Team/Continuous Integration Environment</a> (GitHub) for instructions.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="6">
                  <p>
                    <strong>
                      <span>
                        <a href="https://msdn.microsoft.com/en-us/library/ms182409.aspx">Testing the application</a>
                      </span>
                    </strong>
                  </p>
                </td>
                <td>
                  <p>Planning tests, creating test cases and organizing test suites</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Manual testing</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Test Manager (record and playback tests)</p>
                </td>
                <td>
                  <p>Windows devices and
Android emulators only</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Code coverage</p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Unit tests</p>
                </td>
                <td>
                  <p>Yes, with third-party frameworks</p>
                </td>
                <td>
                  <p>Recommendations are:</p>
                  <ol>
                    <li>
                      <p>
                        <a href="https://github.com/mmanela/chutzpah">Chutzpah test runner</a>: works well with Visual Studio Test Explorer and unit test frameworks such as QUnit, Jasmine, Mocha, CoffeeScript, and TypeScript. Runs test through PhantomJS allowing you to easily run tests during the development cycle.</p>
                    </li>
                    <li>
                      <p>
                        <a href="http://karma-runner.github.io">Karma test runner</a>: supports running tests within most environments (emulators, remote devices, browsers, etc.) and therefore provides a more comprehensive test runner than Chutzpah. Integration with Visual Studio can be accomplished with the <a href="https://visualstudiogallery.msdn.microsoft.com/8e1b4368-4afb-467a-bc13-9650572db708">Task Runner Explorer extension</a> and Gulp/Grunt.</p>
                    </li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/dd286726.aspx">Use UI Automation To Test Your Code</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>Windows only</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="4">
                  <p>
                    <strong>Diagnose</strong>
                  </p>
                </td>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/dd264939.aspx">Analyzing Managed Code Quality by Using Code Analysis</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>No</p>
                </td>
                <td rowspan="3">
                  <p>These tools all rely on .NET code and do not presently work with JavaScript.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/hh205279.aspx">Finding Duplicate Code by using Code Clone Detection</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/bb385910.aspx">Measuring Complexity and Maintainability of Managed Code</a>
                    </span>
                  </p>
                </td>
                <td>
                  <p>No</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <span>
                      <a href="https://msdn.microsoft.com/en-us/library/z9z62c29.aspx">Using Profiling Tools</a>
                    </span> (includes CPU Usage, Energy Consumption, GPU Usage, HTML UI Responsiveness, and JavaScript Memory, and Memory Usage)</p>
                </td>
                <td>
                  <p>Windows only</p>
                </td>
                <td>
                  <p>On Windows, Cordova apps run as native Windows apps so all tools are available. These tools are not available when running the app on other platforms.</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td rowspan="3">
                  <p>
                    <strong>
                      <span>
                        <a href="https://msdn.microsoft.com/en-us/library/dn217874.aspx">Automate deployments with Release Management</a>
                      </span>
                    </strong>
                  </p>
                </td>
                <td>
                  <p>Manage release processes</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Deployment to servers for side-loading via scripts</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Upload to app store</p>
                </td>
                <td>
                  <p>n/a</p>
                </td>
                <td>
                  <p>Store submissions always involve manual processes that are unique to each marketplace. See <a href="https://github.com/Microsoft/cordova-docs/tree/master/tutorial-package-publish">Package and Publish your Cordova Applications</a> (GitHub).</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <br>
                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
                <td>
                  <p>

                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <strong>
                      <a href="http://azure.microsoft.com/en-us/documentation/articles/app-insights-get-started/">Monitor with Application Insights</a>
                    </strong>
                  </p>
                </td>
                <td>
                  <p>Logging using SDKs (analysis happens on the Azure portal)</p>
                </td>
                <td>
                  <p>Yes</p>
                </td>
                <td>
                  <p>Use the client-side web app script with one change; for details, see <a href="http://azure.microsoft.com/en-us/documentation/articles/app-insights-platforms/#cordova">App Insights Platforms</a> (Azure documentation).</p>
                </td>
              </tr>
            </tbody></table>
