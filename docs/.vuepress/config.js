module.exports = {
  title: 'Picker Ready Go',
  description: 'a blog from Picker',
  base: '/',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/images/dog.jpeg',
    searchMaxSuggestions: 10,
    smoothScroll: true,
    lastUpdated: '更新时间',
    nav: [
      { text: '基础梳理', link: '/fontEndBase/' },
      { text: '手写', link: '/newFunction/' },
      { text: '源码分析', link: '/sourceAnalysis/' },
      { text: 'react', link: '/react/' },
      {
        text: '脚手架', link: '/falsework/', items: [
          { text: 'webpack', link: '/falsework/webpack/' },
          { text: 'vite', link: '/falsework/vite/' }
        ]
      },
      { text: 'github', link: 'https://github.com/Picker666/blog' },
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
      ],
      '/newFunction/': [
        '',
        'newDeepCopy'
      ],
      "/react/": [
        '',
        'lifeCycleNew',
        'hoc',
        'middleware',
        'hooksApi',
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