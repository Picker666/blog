const { nav, sidebar } = require('./navConfig');

module.exports = {
  title: "Picker Ready Go",
  description: "a blog from Picker",
  base: "/blog/",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    logo: "/images/logo.png",
    searchMaxSuggestions: 10,
    smoothScroll: true,
    // lastUpdated: "更新时间",
    nav,
    sidebar
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@image": "blog",
      },
    },
  },
};