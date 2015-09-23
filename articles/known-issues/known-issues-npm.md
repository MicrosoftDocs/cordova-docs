<properties pageTitle="Known Issues - NPM" 
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

#**Known Issues - NPM**
**NPM Proxy Errors**

If NPM packages aren't installing properly, and you see an error that mentions bad characters in a request, the most likely cause is that there is a proxy/firewall interfering. To fix the issue, execute the following on the command prompt:

~~~~~~~~~~~~~
npm config set proxy http://proxydomain:port/
npm config set registry http://registry.npmjs.org/
~~~~~~~~~~~~~
