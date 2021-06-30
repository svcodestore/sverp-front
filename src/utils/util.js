/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-06-30 16:04:41
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/utils/util.js
 */
export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function arrElCombineSet (arr) {
  // eslint-disable-next-line space-in-parens
  for (var combineSet = []; combineSet.push([]) < arr.length; );
  const combineTimes = Math.pow(2, arr.length) - 1
  for (let i = 1; i <= combineTimes; i++) {
    const combineCases = []
    for (let s = i, k = 0; s > 0; s >>= 1, k++) if ((s & 1) === 1) combineCases.push(arr[k])
    combineSet[combineCases.length - 1].push(combineCases)
  }

  return combineSet
}

export function objArrUniq (arr, pk) {
  const o = {}
  const newArr = arr.reduce((item, next) => {
    let _pk = Object.keys(next).join(',,') + '-' + Object.values(next).join(',,')
    if (typeof pk === 'string') {
      _pk = pk + '-' + next[pk]
    } else if (Array.isArray(pk)) {
      _pk =
        pk.join(',,') +
        '-' +
        pk.reduce((prev, curr) => {
          return prev + next[curr] + ',,'
        }, '')
    }

    if (!o[_pk]) {
      o[_pk] = true
      item.push(next)
    }

    return item
  }, [])

  return newArr
}
