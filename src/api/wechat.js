import request from '@/utils/request'

const api = {
  qrcode: '/wechat/subscribeQRCode',
  checkScan: '/wechat/checkScan',
  getUserInfo: '/wechat/getUserInfo'
}

export const subscribeQRCode = conId => {
  return request({
    url: api.qrcode,
    method: 'post',
    data: { conId }
  })
}

export const checkScan = conId => {
  return request({
    url: api.checkScan,
    method: 'post',
    data: { conId }
  })
}

export const getUserInfo = conId => {
  return request({
    url: api.getUserInfo,
    method: 'post',
    data: { conId }
  })
}

export default {
  getUserInfo,
  checkScan,
  subscribeQRCode
}
