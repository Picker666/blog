module.exports = {
  title: 'Picker Ready Go',
  description: 'a blog from Picker',
  base: '/blog/',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/images/logo1.png',
    searchMaxSuggestions: 10,
    smoothScroll: true,
    lastUpdated: '更新时间',
    nav: [
      { text: '基础梳理', link: '/base/' },
      { text: '手写', link: '/newFunction/' },
      { text: '源码分析', link: '/sourceAnalysis/' },
      { text: 'React', link: '/react/' },
      { text: 'Git', link: '/git/' },
      {
        text: '脚手架', link: '/falsework/', items: [
          { text: 'Webpack', link: '/falsework/webpack/' },
          { text: 'Vite', link: '/falsework/vite/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/Picker666/blog' },
    ],
    sidebar: {
      '/base/': [
        '',
        'toString',
        'valueOf',
        'equal',
        'copy',
        'promiseAll',
        'allSettled',
        'arrayDeDuplication'
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
        'newClass',
        'newPromise',
        'promise',
        'debounce',
        'throttle',
        'forEach',
        'reduce',
        'map',
        'filter',
        'every'
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
        'useRef'
      ],
      "/git/": [
        '',
        'catchUp'
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