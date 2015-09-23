<properties pageTitle="Cordova performance tips"
  description="This is an article on bower tutorial"
  services=""
  documentationCenter=""
  authors="bursteg" />

# Cordova performance tips

Cordova apps are web apps that run "inside" of native apps by using native "web view" UI components. There are therefore three major domains where performance can be affected in a Cordova app:

- The web code, in JS, CSS, and HTML
- The native code, in Objective-C/Swift, Java, or WinJS (Cordova plugin code)
- The bridge between the native and web code (Cordova runtime code)

## Optimizing web code, in JS, CSS, and HTML

There are *very many* things that can be optimized in a web app. The Internet contains a wealth of information on the topic. Optimizations highly relevant to Cordova apps are given below, but afterward we have a list of links for more in-depth reading.

### Removing the 300ms Touch Delay

There is a 300ms delay on some mobile browser platforms between a touch on the screen and its corresponding touch event being fired. For more responsive UI, this delay can be sidestepped. The `fastclick` library (available on [GitHub][fastclick]) conveniently implements this optimization.

### Layout Updates: Fewer is Better

HTML rendering engines recalculate a document layout when CSS rules or DOM element dimensions are changed. These recalculations are expensive, and minimising them improves performance. Editing HTML elements outside of the DOM (e.g. creating new `<div>`s using jQuery) does not cause layout recalculations. Therefore editing HTML in JavaScript and then inserting the edited HTML into the DOM results in fewer layout recalculations and leads to improved performance.

### Images > CSS Gradients

CSS Gradients take longer than static images to render on most HTML rendering engines. Using image gradient backgrounds in place of CSS gradients reduces frame render time.

### Transitions > Setting Properties

CSS3 transitions allow animation and transformation of HTML elements. They are implemented and optimized in most browsers, and usually perform better than "manual" animations (such as setting object `x` and `y` properties at defined intervals).

The Mozilla Developer Network guide on CSS transitions can be found [here][mdn_transitions].

### CSS Animation Loop > Custom Animation Loop

Browser JavaScript APIs expose a function called `requestAnimationFrame`. This allows a callback to be attached to the *rendering engine's frame-rendering loop*, which is already optimized and timed appropriately for rendering. Using it (instead of a custom event loop) to perform any per-frame changes is more performant because the browser's internal rendering code is already heavily optimized.

### External Links

Below are some links for further reading on performance improvements in Cordova apps:

- Christophe Coenraets' [PhoneGap Performance slides][coenraets]
- Ryan Salva's [Cordova Performance presentation][salva]

## Improving native code, in Objective-C/Swift, Java, or WinJS (Cordova plugin code)

In a Cordova app, all code that will usually be written is in JS, CSS, and HTML. However, the source for native Cordova components (like the plugins and the runtime) is open, and it is within the power of an app developer to change it. Optimizing platform-specific code is outside the scope of this document, but many guides are available online for each platform supported by Cordova. They are as follows:

- [Amazon FireOS] [perf_amazon_fireos]
- [Android] [perf_android]
- [BlackBerry 10] [perf_blackberry]
- [iOS] [perf_ios]
- [Tizen][perf_tizen]
- [WinJS] [perf_winjs]
- Browsers: [Chrome][perf_chrome], [Firefox][perf_firefox], [Safari][perf_safari], [Opera][perf_opera]

## Navigating the Web-to-Native Bridge (Cordova runtime code)

Between the web code and native code is the Cordova runtime JavaScript and native code, which is also freely available and can be modified by any developer through the same process as is used to modify plugins. All Cordova repositories are available on GitHub under the [Apache organization][cordova_repos], prefixed with the string `cordova-`.

[perf_amazon_fireos]: https://developer.amazon.com/appsandservices/community/post/TxSKXI5UIOVFFU/Build-Higher-Performance-Cordova-Based-Fire-OS-Apps-by-Implementing-Amazon-Web-V
[perf_android]:       http://developer.android.com/training/articles/perf-tips.html
[perf_blackberry]:    https://developer.blackberry.com/native/documentation/best_practices/performance/performance.html
[perf_tizen]:         https://developer.tizen.org/documentation/guides/web-application/w3chtml5supplementary-features/performance-and-optimization
[perf_winjs]:         https://msdn.microsoft.com/en-us/magazine/dn574803.aspx
[perf_ios]:           https://developer.apple.com/library/mac/documentation/Performance/Conceptual/PerformanceOverview/BasicTips/BasicTips.html

[perf_chrome]:  http://addyosmani.com/blog/performance-optimisation-with-timeline-profiles/
[perf_firefox]: https://developer.mozilla.org/en-US/docs/Mozilla/Performance
[perf_opera]:   http://google.com
[perf_safari]:  http://google.com

[coenraets]:       http://coenraets.org/keypoint/phonegap-performance/#0
[salva]:           https://channel9.msdn.com/Events/Build/2015/3-756
[fastclick]:       https://github.com/ftlabs/fastclick
[mdn_transitions]: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions
[cordova_repos]:   https://github.com/apache/?utf8=%E2%9C%93&query=cordova-
