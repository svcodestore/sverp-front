/*
 * @Author: yanbuw1911
 * @Date: 2021-01-04 14:28:37
 * @LastEditTime: 2021-01-05 10:59:16
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\server\index.js
 */

const Controller = require('./controller')
const http = require('http')
const server = http.createServer()
const controller = new Controller()

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.status = 200
    res.end()

    return
  }

  switch (req.url) {
    case '/verify':
      await controller.handleVerifyUpload(req, res).catch(() => {})
      break
    case '/merge':
      await controller.handleMerge(req, res).catch(() => {})
      break
    case '/':
      await controller.handleFormData(req, res).catch(() => {})
      break
  }
})

server.listen(3000, () => console.log('正在监听 localhost:3000'))
