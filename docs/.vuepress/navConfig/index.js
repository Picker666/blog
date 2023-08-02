const { baseNav, baseSidebar } = require('./base');
const { libraryNav, librarySidebar } = require('./library');
const { engineeringNar, engineeringSidebar } = require('./engineering');
const { designPatternsNav, designPatternsSidebar } = require('./designPatterns');

module.exports = {
  nav: [
    baseNav,
    libraryNav,
    engineeringNar,
    { text: "源码分析", link: "/sourceAnalysis/" },
    { text: "Coding Tear", link: "/codingTear/" },
    { text: "Git", link: "/git/" },
    designPatternsNav,
    // { text: "算法", link: "/algorithm/" },
    {
      text: "前端之外", link: "/outside/", items: [
        { text: "JAVA", link: "https://github.com/Picker666/javaSummary" },
        { text: "PYTHON", link: "/outside/python/" },
      ]
    },
    { text: "Github", link: "https://github.com/Picker666/blog" },
  ],
  sidebar: {
    ...baseSidebar,
    ...librarySidebar,
    ...engineeringSidebar,
    ...designPatternsSidebar,
    "/sourceAnalysis/": [
      "dynamicImportPrinciple",
      "",
      "reduxThunk",
      "useModal",
      "reselect",
      "useState",
      "qiankun",
      "qiankunPrefetch",
      "qiankunLoadApp",
      "qiankunSandbox",
      "vue2Computed",
      "vue2DataProps",
      "nextTicket"
    ],
    "/codingTear/": [
      "",
      "newDeepCopy",
      "deepCopy",
      "newClass",
      "newPromise",
      "promise",
      "debounce",
      "throttle",
      "newBaseFunction",
      "Set",
      "map",
      "instanceof",
      "thousands",
      "loading",
      "loginTimeout",
      "eventEmiter",
      "compose"
    ],
    "/git/": [
      "",
      "flow",
      "commitRules",
      "branchMerge",
      "rebase",
      "mergeOrRebase",
      "catchUp",
      "reset"
    ],

    "/algorithm/": [
      "",
      "algorithmBase",
      "dataStructure",
      "stackQueue",
      "linkedList",

      "linkedListFunc",
      "dichotomy",
      "divideVSDynamic",
      "greedyVSBacktracking",

      "sorting",
      "deduplication",
      "maxDuplication",
      "mergeArray",
      "palindrome",
      "fibonacci",
      "shuffle",

      "sum",
      "dynamicProgram1",
      "dynamicProgram2",
      "dynamicProgram3"
    ],
  },
}