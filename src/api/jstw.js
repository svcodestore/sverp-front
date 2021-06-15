/*
 * @Author: yanbuw1911
 * @Date: 2021-06-10 09:39:07
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-10 09:44:26
 * @Description: Do not edit
 * @FilePath: \sverp-front\src\api\jstw.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const jstwApi = {
  getDetailedDeduction: '/jstw_commute/getDetailedDeduction',
  getInsuranceDeduction: '/jstw_commute/getInsuranceDeduction',
  saveDetailedDeductionOpt: '/jstw_commute/saveDetailedDeductionOpt',
  saveInsuranceDeductionOpt: '/jstw_commute/saveInsuranceDeductionOpt'
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
