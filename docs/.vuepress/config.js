module.exports = {
  title: 'Picker Ready Go',
  description: 'a blog from Picker',
  base: '/blog/',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/images/dog.jpeg',
    searchMaxSuggestions: 10,
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    nav: [
      { text: '基础梳理', link: '/fontEndBase/' },
      { text: '手写基础方法', link: '/newFunction/' },
      { text: '源码分析', link: '/sourceAnalysis/' },
      {
        text: '脚手架', link: '/falsework/', items: [
          { text: 'webpack', link: '/falsework/webpack/' },
          { text: 'vite', link: '/falsework/vite/' }
        ]
      },
      {
        text: 'react', link: '/react/', items: [
          { text: '类组件', link: '/react/classComponent/' },
          { text: 'hooks 组件', link: '/react/hooksComponent/' }
        ]
      },
      { text: 'github', link: 'https://google.com' },
    ],
    sidebar: {
      '/fontEndBase/': [
        '',
        'copy'
      ],
      '/sourceAnalysis/': [
        '',
        'reduxThunk',
        'useModal',
        'reselect',
        'useState'
      ]
    }
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@alias': 'docs'
  //     }
  //   }
  // }
}