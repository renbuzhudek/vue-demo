import {timeStamp2DateStr, fmoney, getbilltype} from './common.js'
import {getStorage} from './storage.js'

// 格式化日期
var Formatdate = (timestamp) => {
  let format = 'Y-M-D'
  return timeStamp2DateStr(format, timestamp)
}
// 格式化金额
var FormatMoney = (val) => {
  return fmoney(val)
}
var format = (val) => {
  return (val - 0).toFixed(2) + '元'
}
var formatmore = (val) => {
  if (/[^0-9\.]/.test(val)) return 'invalid value'
  val = val.replace(/^(\d*)$/, '$1.')
  val = (val + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  val = val.replace('.', ',')
  var re = /(\d)(\d{3},)/
  if (re.test(val)) { val = val.replace(re, '$1,$2') }
  val = val.replace(/,(\d\d)$/, '.$1')
  return val.replace(/^\./, '0.')
}
// var formatGetbilltype =function(key,name){
//   return getbilltype(name,key);
// }

// 格式化票据状态
var getbilltypees = function (index) {
  var data = JSON.parse(getStorage('billtypevalue', 1))
  return data[index]
}
export {
  format,
  formatmore,
  Formatdate,
  FormatMoney,
  // formatGetbilltype,
  getbilltypees
}
