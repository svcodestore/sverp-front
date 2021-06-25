/*
 * @Author: yanbuw1911
 * @Date: 2021-06-10 09:39:07
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-25 14:12:06
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/api/jstw.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const jstwApi = {
  getDeductionVerions: '/jstw_commute/getDeductionVerions',
  getDetailedDeduction: '/jstw_commute/getDetailedDeduction',
  getInsuranceDeduction: '/jstw_commute/getInsuranceDeduction',
  saveDetailedDeductionOpt: '/jstw_commute/saveDetailedDeductionOpt',
  saveInsuranceDeductionOpt: '/jstw_commute/saveInsuranceDeductionOpt',
  getDetailedDeductionByVersion: '/jstw_commute/getDetailedDeductionByVersion'
}

export const getDetailedDeduction = async () =>
  request({
    url: jstwApi.getInsuranceDeduction,
    method: 'post'
  })

export const getInsuranceDeduction = async () =>
  request({
    url: jstwApi.getInsuranceDeduction,
    method: 'post'
  })

export const saveDetailedDeductionOpt = async opt =>
  request({
    url: jstwApi.saveDetailedDeductionOpt,
    method: 'post',
    data: stringify(opt)
  })

export const saveInsuranceDeductionOpt = async opt =>
  request({
    url: jstwApi.saveInsuranceDeductionOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getDeductionVerions = () =>
  request({
    url: jstwApi.getDeductionVerions,
    method: 'post'
  })

export const getDetailedDeductionByVersion = async time =>
  request({
    url: jstwApi.getDetailedDeductionByVersion,
    method: 'post',
    data: stringify({ time })
  })
