module.exports = {
  engineeringNar: {
    text: "前端工程化",
    link: "/engineering/",
    items: [
      { text: "Common", link: "/engineering/common/" },
      { text: "Pack", link: "/engineering/pack/" },
      { text: "Webpack", link: "/engineering/webpack/" },
      { text: "Vite", link: "/engineering/vite/" },
      { text: "Umi", link: "/engineering/umi/" },
      { text: "qiankun", link: "/engineering/qiankun/" },
    ],
  },
  engineeringSidebar: {
    "/engineering/common/": ["", "standard", "modulesHistory", "packTool", "Helmet", "firstPageOp", "packageManage", "catchError"],
    "/engineering/pack/": ["", "modular", "AST", "runtime"],
    "/engineering/webpack/": [
      "",
      "start",
      "buildProcess",
      "optimization",
      "loaderAndPlugin",
      "AST",
      "HMR",
      "dynamicImport",
      "externals",
      "interview"
    ],
    "/engineering/umi/": ["", "route", "dynamicImport", "NoHistory"],
    "/engineering/vite/": ["", "principle"],
    "/engineering/qiankun/": ["", "buildProject", "sandbox"],
  }
}