module.exports = {
  baseNav: {
    text: "基础梳理",
    link: "/base/",
    items: [
      { text: "HTML", link: "/base/html/" },
      { text: "CSS", link: "/base/css/" },
      { text: "Javascript", link: "/base/javascript/" },
      { text: "Typescript", link: "/base/typescript/" },
      { text: "浏览器", link: "/base/browser/" },
      { text: "安全", link: "/base/security/" },
      { text: "Interview", link: "/base/interview/" },
      { text: "Performance", link: "/base/performance/" },
    ],
  },
  baseSidebar: {
    "/base/html/": ["", "deferAsync"],
    "/base/css/": [
      "",
      "selectorWeight",
      "BFC",
      "flexBox",
      "flexItemSetting",
      "grid",
      "center",
      "columnsLayout",
      "hide",
      "clip",
      "pseudo",
      "triangle",
    ],
    "/base/javascript/": [
      "",
      "ECMAScript",
      "scope",
      "var",
      "closure",
      "toString",
      "valueOf",
      "equal",
      "copy",
      "promiseAll",
      "allSettled",
      "promiseAsync",
      "arrayDeDuplication",
      "newConstructor",
      "setMap",
      "arrayPerformance",
      "prototype",
      "inherit",
      "eventLoop",
      "Proxy",
      "Reflect",
      "functionalProgramming",
      "generator",
      "eventModel",
      "onLoadReady",
      "ajax",
      "imageLazyLoading",
      "webWorker",
      "transcoding",
    ],
    "/base/typescript/": [
      "",
      "tsBase",
      "tsAdvanced1",
      "tsAdvanced2",
      "infer",
      "innerTool",
      "practice",
      "typeInterface",
    ],
    "/base/browser/": [
      "",
      "workingPrinciple",
      "storage",
      "crossDomain",
      "tokenSession",
      "dnsPrefetch",
      "browserCache",
      "cache",
      "serviceWorker",
      "workbox",
      "httpCode",
      "HSTS",
      "UDP",
      "TCP",
      "https",
      "http&https",
      "httpVersion",
      "getPost",
      "originAndReferer",
      "renderPrinciple",
      "urlToRender",
      "garbageCollection",
      "garbageCollectionByV8",
      "whiteScreen",
    ],
    "/base/security/": [
      "",
      "xss",
      "CSRF",
      "SQLInjection",
      "cookieHold",
      "clickJacking",
      "logical",
    ],
    "/base/interview/": [
      "",
      "scope",
      "questionAnswer",
      "arrayObject",
      "FEOptimization",
      "collections",
      "upload",
    ],
    "/base/performance/": [
      "",
      "RAIL",
      "WebPageTest",
      "lighthouse",
      "renderOptimizetion",
    ],
  },
};
