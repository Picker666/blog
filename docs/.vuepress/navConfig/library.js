module.exports = {
  libraryNav: {
    text: "库&框架",
    link: "/library/",
    items: [
      { text: "transverse", link: "/library/transverse/" },
      { text: "React", link: "/library/react/" },
      { text: "Vue", link: "/library/vue/" },
      { text: "Redux", link: "/library/redux/" },
      { text: "ThreeJS", link: "/library/threeJS/" },
    ],
  },
  librarySidebar: {
    "/library/transverse/": ["", "reactVue"],
    "/library/react/": [
      "",
      "lifeCycleNew",
      "lifeCycleChange",
      "setState",
      "super",
      "hoc",
      "middleware",
      "useState",
      "useEffect",
      "useMemo",
      "useCallback",
      "useRef",
      "useLayoutEffect",
      "reactEvent",
      "simpleReducer",
      "virtualDom",
      "fiber",
      "diff",
      "requestIdleCallback",
      "loadable",
      "lazy",
      "loadableComponent",
      "componentControlled",
      "react18",

      "nextRenderWay",
      "nextImages",

      "importReact"
    ],
    "/library/vue/": ["", "lifeCycle", "computedWatch", "twoWayDataBind", "diff", "interview"],
    "/library/redux/": [""],

    "/library/threeJS/": [""],
  }
}