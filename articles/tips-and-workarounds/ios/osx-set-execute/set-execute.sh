#!/bin/sh
#
# Copyright (c) Microsoft. All rights reserved.  
# Licensed under the MIT license. See LICENSE file in the project root for full license information. 
#
find -E platforms/ios/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
find -E platforms/android/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
find -E platforms/windows/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
find -E platforms/wp8/cordova -type f -regex "[^.(LICENSE)]*" -exec chmod +x {} +
