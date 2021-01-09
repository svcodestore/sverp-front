/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:15:29
 * @LastEditTime: 2020-12-25 10:10:33
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\docs\development\.vuepress\config.js
 */
module.exports = {
  base: '/docs/development/',
  dest: '../../dist/docs/development',
  head: [['link', { rel: 'icon', href: '../../favicon.ico' }]],
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      selectText: '选择语言',
      lang: 'zh-CN',
      title: '开发手册',
      description: '系统开发手册'
    },
    '/en/': {
      selectText: 'Languages',
      lang: 'en-US',
      title: 'Development Manual',
      description: 'System Development Manual'
    }
  },
  plugins: [
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10
      }
    ],
    ['@vuepress/back-to-top', true],
    ['@vuepress/medium-zoom'],
    ['flowchart'],
    ['@vuepress/plugin-last-updated'],
    ['vuepress-plugin-mermaidjs']
  ],
  smoothScroll: true,
  extraWatchFiles: ['.vuepress/nav/en.js', '.vuepress/nav/zh.js'],
  themeConfig: {
    // sidebar: 'auto',
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          { text: '准备', link: '/preparation' },
          { text: '项目介绍', link: '/introduction' },
          { text: '构建开发环境', link: '/build-dev-env' },
          { text: '开发约定', link: '/convention' }
        ],
        sidebar: {
          '/': getSideBar('手册')
        }
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'Preparation', link: '/en/preparation' },
          { text: 'Introduction', link: '/en/introduction' },
          { text: 'Build Dev Env', link: '/en/build-dev-env' },
          { text: 'Coding Convention', link: '/en/introduction' }
        ],
        sidebar: {
          '/en/': getSideBar('Manual')
        }
      }
    }
  }
}

function getSideBar (groupA) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: ['', 'system-management', 'production-dept']
    }
  ]
}
