(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[165],{2167:function(e,n,t){"use strict";var r=t(3848),o=t(9448);n.default=void 0;var c=o(t(7294)),i=t(9414),a=t(4651),s=t(7426),l={};function u(e,n,t,r){if(e&&(0,i.isLocalURL)(n)){e.prefetch(n,t,r).catch((function(e){0}));var o=r&&"undefined"!==typeof r.locale?r.locale:e&&e.locale;l[n+"%"+t+(o?"%"+o:"")]=!0}}var f=function(e){var n,t=!1!==e.prefetch,o=(0,a.useRouter)(),f=c.default.useMemo((function(){var n=(0,i.resolveHref)(o,e.href,!0),t=r(n,2),c=t[0],a=t[1];return{href:c,as:e.as?(0,i.resolveHref)(o,e.as):a||c}}),[o,e.href,e.as]),d=f.href,_=f.as,v=e.children,h=e.replace,p=e.shallow,m=e.scroll,x=e.locale;"string"===typeof v&&(v=c.default.createElement("a",null,v));var j=(n=c.Children.only(v))&&"object"===typeof n&&n.ref,g=(0,s.useIntersection)({rootMargin:"200px"}),N=r(g,2),y=N[0],b=N[1],w=c.default.useCallback((function(e){y(e),j&&("function"===typeof j?j(e):"object"===typeof j&&(j.current=e))}),[j,y]);(0,c.useEffect)((function(){var e=b&&t&&(0,i.isLocalURL)(d),n="undefined"!==typeof x?x:o&&o.locale,r=l[d+"%"+_+(n?"%"+n:"")];e&&!r&&u(o,d,_,{locale:n})}),[_,d,b,x,t,o]);var E={ref:w,onClick:function(e){n.props&&"function"===typeof n.props.onClick&&n.props.onClick(e),e.defaultPrevented||function(e,n,t,r,o,c,a,s){("A"!==e.currentTarget.nodeName||!function(e){var n=e.currentTarget.target;return n&&"_self"!==n||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&(0,i.isLocalURL)(t))&&(e.preventDefault(),null==a&&r.indexOf("#")>=0&&(a=!1),n[o?"replace":"push"](t,r,{shallow:c,locale:s,scroll:a}))}(e,o,d,_,h,p,m,x)},onMouseEnter:function(e){(0,i.isLocalURL)(d)&&(n.props&&"function"===typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),u(o,d,_,{priority:!0}))}};if(e.passHref||"a"===n.type&&!("href"in n.props)){var T="undefined"!==typeof x?x:o&&o.locale,L=o&&o.isLocaleDomain&&(0,i.getDomainLocale)(_,T,o&&o.locales,o&&o.domainLocales);E.href=L||(0,i.addBasePath)((0,i.addLocale)(_,T,o&&o.defaultLocale))}return c.default.cloneElement(n,E)};n.default=f},7426:function(e,n,t){"use strict";var r=t(3848);n.__esModule=!0,n.useIntersection=function(e){var n=e.rootMargin,t=e.disabled||!i,s=(0,o.useRef)(),l=(0,o.useState)(!1),u=r(l,2),f=u[0],d=u[1],_=(0,o.useCallback)((function(e){s.current&&(s.current(),s.current=void 0),t||f||e&&e.tagName&&(s.current=function(e,n,t){var r=function(e){var n=e.rootMargin||"",t=a.get(n);if(t)return t;var r=new Map,o=new IntersectionObserver((function(e){e.forEach((function(e){var n=r.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;n&&t&&n(t)}))}),e);return a.set(n,t={id:n,observer:o,elements:r}),t}(t),o=r.id,c=r.observer,i=r.elements;return i.set(e,n),c.observe(e),function(){i.delete(e),c.unobserve(e),0===i.size&&(c.disconnect(),a.delete(o))}}(e,(function(e){return e&&d(e)}),{rootMargin:n}))}),[t,n,f]);return(0,o.useEffect)((function(){if(!i&&!f){var e=(0,c.requestIdleCallback)((function(){return d(!0)}));return function(){return(0,c.cancelIdleCallback)(e)}}}),[f]),[_,f]};var o=t(7294),c=t(3447),i="undefined"!==typeof IntersectionObserver;var a=new Map},3037:function(e,n,t){"use strict";t.d(n,{$_:function(){return a},h4:function(){return f},JO:function(){return v},Ar:function(){return m},TH:function(){return b}});var r=t(5893),o=t(7294),c=t(1890),i=t.n(c),a=function(){return(0,r.jsx)("footer",{className:i().footer,children:(0,r.jsx)("small",{children:"Code snippets licensed under MIT, unless otherwise noted."})})},s=t(1664),l=t(4190),u=t.n(l),f=function(){return(0,r.jsxs)("nav",{className:u().navigation__container,children:[(0,r.jsx)("div",{className:u().navigation,children:(0,r.jsx)(s.default,{href:"/",children:"/var/log/koka"})}),(0,r.jsx)("div",{children:(0,r.jsx)(s.default,{href:"/archives",children:"archive"})})]})},d=t(5861),_=t.n(d),v=function(){return(0,r.jsxs)("div",{className:_().icon__container,children:[(0,r.jsxs)("ul",{className:_().icon,children:[(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{className:_().green})]}),(0,r.jsxs)("ul",{className:_().icon,children:[(0,r.jsx)("li",{}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{})]}),(0,r.jsxs)("ul",{className:_().icon,children:[(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{}),(0,r.jsx)("li",{className:_().green})]}),(0,r.jsxs)("ul",{className:_().icon,children:[(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green})]}),(0,r.jsxs)("ul",{className:_().icon,children:[(0,r.jsx)("li",{}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{className:_().green}),(0,r.jsx)("li",{})]})]})},h=t(3041),p=t.n(h),m=function(e){var n=e.children;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(f,{}),(0,r.jsx)("main",{className:p().container,children:n}),(0,r.jsx)(a,{})]})},x=t(1385),j=function(e){var n,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500,r=function(){n||(n=!0,e.apply(void 0,arguments),setTimeout((function(){n=!1}),t))};return r},g=t(6467),N=t.n(g),y=function(e){var n=e.title,t=e.depth,o=e.active,c=e.onClick,i="toc__h".concat(t);return(0,r.jsx)("li",{onClick:c,className:"\n        ".concat(o?N().toc__active:"","\n        ").concat(N()[i],"\n        "),children:n})},b=function(){var e=(0,o.useState)({titles:[],nodes:[],minDepth:0}),n=e[0],t=e[1],c=(0,o.useState)(),i=c[0],a=c[1];return(0,o.useEffect)((function(){var e=["h1","h2","h3","h4"].join(","),n=Array.from(document.querySelectorAll(e)),r=n.map((function(e){return{title:e.innerText,depth:Number(e.nodeName[1])}})),o=Math.min.apply(Math,(0,x.Z)(r.map((function(e){return e.depth}))));t({titles:r,nodes:n,minDepth:o})}),[]),(0,o.useEffect)((function(){var e=j((function(){var e=n.titles,t=n.nodes.map((function(e){return function(e){for(var n=0;e instanceof HTMLElement;)n+=e.offsetTop-e.scrollTop+e.clientTop,e=e.offsetParent;return n}(e)})).findIndex((function(e){return e>window.scrollY}));a(-1===t?e.length-1:t-1)}));return window.addEventListener("scroll",e),function(){return window.removeEventListener("scroll",e)}}),[n]),(0,r.jsx)("nav",{className:N().toc__nav,role:"navigation",children:(0,r.jsx)("ul",{className:N().toc,children:n.titles.map((function(e,t){var o=e.title,c=e.depth;return(0,r.jsx)(y,{title:o,depth:c,active:i===t,onClick:function(e){return function(e,t){e.preventDefault(),n.nodes[t].scrollIntoView({behavior:"smooth"})}(e,t)}},"".concat(null===o||void 0===o?void 0:o.replace(/ /g,"_"),"_").concat(c))}))})})}},8190:function(e,n,t){"use strict";t.r(n),t.d(n,{__N_SSG:function(){return c}});var r=t(5893),o=(t(7294),t(3037)),c=!0;n.default=function(e){var n=e.tags;return(0,r.jsx)(o.Ar,{children:n.map((function(e){return(0,r.jsx)("p",{children:e},e)}))})}},4333:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/tags",function(){return t(8190)}])},1890:function(e){e.exports={footer:"Footer_footer__cAlbN"}},4190:function(e){e.exports={navigation__container:"Header_navigation__container__3D5xg",navigation:"Header_navigation__16lxy",cursor:"Header_cursor__2dspt"}},5861:function(e){e.exports={icon__container:"Icon_icon__container__zXY7M",icon:"Icon_icon__2P9f5",green:"Icon_green__DJdcM"}},3041:function(e){e.exports={container:"Layout_container__QVNsN"}},6467:function(e){e.exports={toc__nav:"Toc_toc__nav__2o5GC",toc:"Toc_toc__3i1gg",toc__active:"Toc_toc__active__3Lha6",toc__h1:"Toc_toc__h1__x9SsE",toc__h2:"Toc_toc__h2__1gntT",toc__h3:"Toc_toc__h3__3-rtF"}},1664:function(e,n,t){e.exports=t(2167)},1385:function(e,n,t){"use strict";function r(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function o(e){return function(e){if(Array.isArray(e))return r(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,n){if(e){if("string"===typeof e)return r(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?r(e,n):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}t.d(n,{Z:function(){return o}})}},function(e){e.O(0,[774,888,179],(function(){return n=4333,e(e.s=n);var n}));var n=e.O();_N_E=n}]);