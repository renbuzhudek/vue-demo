import axios from 'axios'
import { billSign } from '../lib/tenderjs3/browersign.js'
import { getStorage, clearStorage, setStorage } from './storage.js'
import regex from '../config/config_regex.js'
import api from '../config/config_api.js'
import dictionary from '../config/config_dictionary.js'
import store from '../store/main'

// 字符串去除逗号
var removeComma = function (val) {
  return val.replace(/,/g, '')
}

var caninput = function (val) {
  let nochinaese = ''
  if (val) {
    nochinaese = val.replace(/[\u4e00-\u9fa5]/g, '')
  }
  return nochinaese
}

/* 时间戳转换函数 */
var timeStamp2DateStr = function (format, timestamp) {
  var date = new Date(timestamp ? (parseInt(timestamp)) : new Date().getTime())
  var FORMAT = new Object()
  FORMAT = {
    'Y': 'date.getFullYear()',
    'M': "date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1",
    'D': "date.getDate() < 10 ? '0' + date.getDate() : date.getDate()",
    'h': "date.getHours() < 10 ? '0' + date.getHours() : date.getHours()",
    'm': "date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()",
    's': "date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()"
  }
  for (var i in FORMAT) {
    if (format.indexOf(i) != -1) {
      format = format.replace(i, eval(FORMAT[i]))
    }
  }
  return format
}

// date1小日期 date2大日期  格式 2017/11/22
var totalDays = function (date1, date2) {
  if (date1 && date2) {
    date1 = date1.replace(/-/g, '/')
    date2 = date2.replace(/-/g, '/')
    let s1 = new Date(date1)
    let s2 = new Date(date2)
    let time = s2.getTime() - s1.getTime()
    let days = parseInt(time / (1000 * 60 * 60 * 24))
    return days
  }
}
// 组件时间格式转换
var temptime = function (temptime) {
  if (temptime != '' && typeof temptime === 'object') {
    var mouth = temptime.getMonth() + 1
    var date = temptime.getDate()
    if (mouth < 10) {
      mouth = '0' + mouth
    }
    if (date < 10) {
      date = '0' + date
    }
    temptime = temptime.getFullYear() + '-' + mouth + '-' + date
  }
  return temptime
}
var setContentHeight = function (fixedHeight) {
  var conHeight = $(window).height() - (fixedHeight || 200)
  return conHeight
}
var getCompanyList = function (_this, url, name, callback) {
  var directionals = []
  post(_this, url, { name: name }, response => {
    if (response.code == 100) {
      directionals = response.data.map(e => ({
        value: e.id,
        label: e.name
      }))
      if (typeof callback === 'function') {
        callback(directionals)
      }
    } else {
      console.log('获取失败')
    }
  })
}

let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const xhrRequest = (type, _this, url, params, ...needles) => {
  let header = {
    'X-Requested-With': 'XMLhttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  let callback = ''
  let dataparam = ''
  let pendingParam = ''
  if (type == 'post') {
    if (params) {
      dataparam = _this.querystring.stringify(params)
    }
  } else {
    dataparam = params
  }
  pendingParam = _this.querystring.parse(dataparam)
  delete (pendingParam.blockCode)

  for (let needle of needles) {
    if (typeof (needle) === 'object') {
      for (let key in header) {
        if (needle[key]) {
          header[key] = needle[key]
          dataparam = params
        }
      }
    } else if (typeof (needle) === 'function') {
      callback = needle
    }
  }
  new Promise((resolve, reject) => {
    let options = {
      method: type,
      url: url,
      xhrFields: { withCredentials: true }, // 发送凭据
      headers: header
    }
    if (type == 'get') {
      options.params = dataparam
    } else if (type == 'post') {
      options.data = dataparam
    }

    // 拦截相同请求
    let isRepeat = false
    let pendingStr = options.url + '&' + options.method + '&' + _this.querystring.stringify(pendingParam)
    if (pending.indexOf(pendingStr) > -1) { // 当当前请求在数组中存在时
      isRepeat = true // 执行取消操作
    }
    if (isRepeat) {
      resolve()
    } else {
      // 先push进去
      pending.push(pendingStr)
      return axios(options)
        .then(response => {
        // 删除数组里面的元素
          pending.splice(pending.indexOf(pendingStr), 1)
          if (response.status == 200) {
            if (typeof callback === 'function') {
              if (response.data.code != 0 && url.indexOf('system/user/login') < 0) {
                setStorage('errorstate', response.data, 0)
                _this.$store.commit('setErrorDialog', true)
                _this.$store.commit('setErrorMsg', response.data.msg)
                _this.$store.commit('setErrorCode', response.data.code)
                callback(response.data)
              } else {
                _this.$store.commit('setErrorDialog', false)
                callback(response.data)
              }
            } else {
              clearStorage('errorstate', 0)
              return response.data
            }
            resolve()
          }
        })
        .catch(function (response) {
        // 删除数组里面的元素
          pending.splice(pending.indexOf(pendingStr), 1)

          console.log(response)
          resolve()
        })
    }
  })
}

/**
   * [get]
   * @param  {[string]} url
   * @param  {[object]} params [get params]
   * @return {[promise object]} axios [a promise object]
   */

const get = function (_this, url, params, ...needles) {
  xhrRequest('get', _this, url, params, ...needles)
}
/**
   * [post]
   * @param  {[string]} url
   * @param  {[object]} params [post body]
   * @return {[promise object]} axios [a promise object]
   */
const post = function (_this, url, params, ...needles) {
  xhrRequest('post', _this, url, params, ...needles)
}
// 判断企业角色是否完整
var ishasRole = function (_this, callback) {
  post(_this, api.userSelect, '', callback)
}
// 金额小写转大写 num表示金额
var smalltobig = function (num) {
  var strOutput = ''
  var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  num += '00'
  var intPos = num.indexOf('.')
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (var i = 0; i < num.length; i++) {
    strOutput +=
      '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strOutput
    .replace(/零角零分$/, '整')
    .replace(/零[仟佰拾]/g, '零')
    .replace(/零{2,}/g, '零')
    .replace(/零([亿|万])/g, '$1')
    .replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿')
    .replace(/^元/, '零元')
}

// 获取url参数
var GetRequest = function () {
  var url = location.search // 获取url中"?"符后的字串
  var theRequest = new Object()
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}

// 给金额加逗号

var fmoney = function (ATR) {
  let str = String(ATR)
  let count = 0,
    newStr = ''
  if (str == '') {
    return ''
  }
  if (str.indexOf('.') == -1) {
    str = String(parseFloat(str.replace(/[^\d\.-]/g, '')))
    for (var i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
  } else {
    str = String(str.replace(/[^\d\.-]/g, ''))
    if (str.indexOf('.') - 1 < 0) {
      newStr = ATR
    } else {
      for (var i = str.indexOf('.') - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = str.charAt(i) + ',' + newStr
        } else {
          newStr = str.charAt(i) + newStr // 逐个字符相接起来
        }
        count++
      }
    }
    let sint = (str + '00').substr((str + '00').indexOf('.'), 3)
    if (sint == '0') {
      str = newStr
    } else {
      let strl = str.substr(str.indexOf('.'), 3)
      if (strl.length > 3) {
        str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
      } else {
        str = newStr + strl
      }
    }
  }
  return str
}

// 保留小数点2位
var textfix = function (nnumber) {
  var newnumber = nnumber.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return newnumber
}
// 只能输入数字和逗号
var inputtext = function (val) {
  var textval = val.value.replace(/[^\d|,]/g, '')
  return textval
}
// 过滤输入框中的金额
var filters = function (val) {
  if (/[^0-9\.]/.test(val)) return 'invalid value'
  val = val.replace(/^(\d*)$/, '$1.')
  val = (val + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  val = val.replace('.', ',')
  var re = /(\d)(\d{3},)/
  while (re.test(val)) val = val.replace(re, '$1,$2')
  val = val.replace(/,(\d\d)$/, '.$1')
  return val.replace(/^\./, '0.') + '￥'
}

/** 验证正则匹配
 * [post]
 * @param  {[string]} value    待验证的值
 * @param  {[object]} regexName 验证规则的名字
 * @return
 */
var testRegex = function (value, regexName, msg) {
  let istrue = false
  for (let i = 0; i < regex[regexName].reg.length; i++) {
    if (!regex[regexName].reg[i].test(value)) {
      istrue = true
    }
  }
  if (istrue) {
    return msg || regex[regexName].msg
  }
}
// 票据状态
var getbilltype = function (type, num) {
  num = dictionary['sbilltype'][type] + String(num)
  if (num) {
    return dictionary['billtype'][num]
  }
}
/** 字典配成select
 * @param  {[string]} name    字典名
 * @return
 */
var selectdata = function (name) {
  let listarray = []
  for (let key in dictionary[name]) {
    let labelvalue = {
      label: '',
      value: ''
    }
    labelvalue.label = dictionary[name][key]
    labelvalue.value = key
    listarray.push(labelvalue)
  }
  return listarray
}

// var scale = function(val){
//   if(val){
//     return dictionary.companyScale[val];
//   }
// }
// 文件下载 api是下载链接  data是请求参数
var downloadFile = function (api, data) {
  var $form = $('<form>')// 定义一个form表单
  var $inputs = []
  $form.attr('style', 'display:none')
  $form.attr('target', '')
  $form.attr('method', 'post')
  $form.attr('enctype', 'application/x-www-form-urlencoded')
  $form.attr('action', api)

  // 设置参数
  for (var key in data) {
    var $input = '<input name="' + key + '" value="' + data[key] + '">'
    $inputs.push($input)
  }
  $('body').append($form)// 将表单放置在web中
  $form.append($inputs.join(''))
  $form.submit()// 表单提交
  $form.remove()
}
var billNoteSigns = function () {
  return new billSign()
}
export {
  get,
  post,
  fmoney,
  smalltobig,
  temptime,
  GetRequest,
  setContentHeight,
  getCompanyList,
  filters,
  billNoteSigns,
  testRegex,
  textfix,
  removeComma,
  selectdata,
  totalDays,
  timeStamp2DateStr,
  getbilltype,
  inputtext,
  caninput,
  ishasRole,
  downloadFile
}
