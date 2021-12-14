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
    lastUpdated: '更新时间',
    nav: [
      { text: '基础梳理', link: '/fontEndBase/' },
      { text: '手写', link: '/newFunction/' },
      { text: '源码分析', link: '/sourceAnalysis/' },
      { text: 'React', link: '/react/' },
      {
        text: '脚手架', link: '/falsework/', items: [
          { text: 'Webpack', link: '/falsework/webpack/' },
          { text: 'Vite', link: '/falsework/vite/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/Picker666/blog' },
    ],
    sidebar: {
      '/fontEndBase/': [
        '',
        'copy',
        'toString'
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
        'newDeepCopy',
        'newClass'
      ],
      "/react/": [
        '',
        'lifeCycleNew',
        'hoc',
        'middleware',
        'useState',
        'useEffect',
        'useMemo',
        'useCallback',
      ]

    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@image': 'blog'
      }
    }
  }
}