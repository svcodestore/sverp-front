export function request (url) {
  return new Promise(resolve => {
    // eslint-disable-next-line no-undef
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : ActiveXObject('microsoft.XMLHttp')
    xhr.open('get', url, true)
    xhr.send()
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr
      if (readyState === 4) {
        if (status === 200) resolve(JSON.parse(xhr.response))
      }
    }
  })
}
