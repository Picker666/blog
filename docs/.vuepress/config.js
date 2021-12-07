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
      // { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://google.com' },
    ],
    // sidebar: [
    //   '/',
    //   '/page-a',
    //   ['/page-b', 'Explicit link text']
    // ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        // '@alias': 'docs'
      }
    }
  }
}