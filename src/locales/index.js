/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2020-12-31 10:26:55
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\index.js
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import storage from 'store'
import moment from 'moment'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import zhCN from './lang/zh-CN/'
import zhTW from './lang/zh-TW/'
import enUS from './lang/en-US/'

import VxeTableZhCN from 'vxe-table/lib/locale/lang/zh-CN'
import VxeTableZhTW from 'vxe-table/lib/locale/lang/zh-TW'
import VxeTableEnUS from 'vxe-table/lib/locale/lang/en-US'

Vue.use(VueI18n)

// 緩存的語言優先
export const defaultLang = storage.set('app_language') || storage.set('lang') || 'zh-CN'

const messages = {
  'zh-CN': {
    ...zhCN,
    ...VxeTableZhCN
  },
  'zh-TW': {
    ...zhTW,
    ...VxeTableZhTW
  },
  'en-US': {
    ...enUS,
    ...VxeTableEnUS
  }
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

const loadedLanguages = [defaultLang]

Vue.use(VXETable, {
  translate: key => i18n.t(key),
  i18n: key => i18n.t(key)
})

function setI18nLanguage (lang) {
  i18n.locale = lang
  // request.headers['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang = defaultLang) {
  return new Promise(resolve => {
    // 缓存语言设置
    storage.set('lang', lang)
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then(msg => {
          const locale = msg.default
          i18n.setLocaleMessage(lang, locale)
          loadedLanguages.push(lang)
          moment.updateLocale(locale.momentName, locale.momentLocale)
          return setI18nLanguage(lang)
        })
      }
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  })
}

export function i18nRender (key) {
  return i18n.t(`${key}`)
}

export default i18n
