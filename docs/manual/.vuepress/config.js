/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:15:29
 * @LastEditTime: 2021-02-22 10:46:55
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/docs/manual/.vuepress/config.js
 */

module.exports = {
  base: '/docs/manual/',
  dest: '../../dist/docs/manual',
  head: [['link', { rel: 'icon', href: '../../favicon.ico' }]],
  markdown: {
    lineNumbers: true
  },
  locales: {
    '/': {
      selectText: '选择语言',
      lang: 'zh-CN',
      title: '使用手册',
      description: '系统使用手册'
    },
    '/en/': {
      selectText: 'Languages',
      lang: 'en-US',
      title: 'Usage Manual',
      description: 'System Usage Manual'
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
      children: ['', 'dashboard', 'production-dept', 'hr-dept']
    }
  ]
}
