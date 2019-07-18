<template>
    <div>
<button @click="downloadExcel(json)">下载excel</button>
<button @click="downloadTagExcel">下载树形结构excel</button>
<input type="file" @change="loadExcel"/>
    </div>
</template>

<script>
import treeData from './mock-tree.json'
import originData from './originData.json'
export default {
  name: 'excel',
  prop: {

  },
  data () {
    return {
      uploadFile: {
        name: '',
        alias: '',
        extension: '',
        time: '',
        size: '',
        file: ''
      },
      json: [ {
        '星期一': '123456789',
        '星期二': '123456789',
        '星期三': '123456789'
      }, {
        '星期一': '123456789',
        '星期二': '123456789',
        '星期三': '123456789'
      }, {
        '星期一': '123456789',
        '星期二': '123456789',
        '星期三': '123456789'
      } ],
      excelData: {},
      tableData: [],
      colData: [],
      originData: originData
    }
  },
  mounted () {
    this.initData()
    this.exportList()
  },
  methods: {
    // 拉平tree
    flatten (array) {
      let arr = array || []
      return [].concat(...arr.map(item => [].concat(item, ...this.flatten(item.children))))
    },
    // 下载转换后的表格
    downloadTagExcel () {
      // 添加ID
      let transform = this.transformData(treeData)
      console.log('transform:::', transform)
      // 拉平tree
      let concatData = this.flatten(transform)

      for (let item of concatData) {
        delete item.children
      }

      let indexArr = []
      let num = 0
      let n = 0
      for (let [index, item] of concatData.entries()) {
      // 再合适的分割位置缓存index
        if (index < concatData.length - 1 && item.ID.split('.').length - 1 !== concatData[index + 1].ID.split('.').length - 1) {
          indexArr.push(index + 1)
        }
      }
      // 加空行
      for (let index of indexArr) {
        concatData.splice(index + num, 0, {ID: ''})
        num += 1
      }
      console.log('concatData:::', concatData)
      let ws = XLSX.utils.json_to_sheet(concatData)
      ws['!merges'] = []
      for (let index of indexArr) {
      // 把插入的空数据的哪一行并列,变成空行

        ws['!merges'].push({
          s: {
            c: 0,
            r: index + n + 1
          },
          e: {
            c: 100,
            r: index + n + 1
          }
        })
        n += 1
      }
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 下载
      XLSX.writeFile(wb, '库存报表按SKU.xlsx')
    },
    // 添加ID标记
    transformData (data, ID = undefined) {
      let transform = data.map((item, index) => {
        let excelRow = {}
        if (ID) {
          excelRow.ID = ID + (index + 1)
        } else {
          excelRow.ID = `${index + 1}`
        }
        excelRow['物料编号'] = item.materielCode || ''
        excelRow['物料名称'] = item.materielLabel || ''
        if (item.children.length > 0) excelRow.children = this.transformData(item.children, `${excelRow.ID}.`)
        return excelRow
      })
      return transform
    },
    // transformData (data, ID = undefined) {
    //   // if (ID) { 1 1.1
    //   //   ID.split('.')
    //   // }
    //   let num = 1
    //   data.map((item, index) => {
    //     if (ID) {
    //       if (item.children.length > 0) {
    //         num += 1
    //         item.ID = ID + num
    //       } else {
    //         item.ID = ID + 1
    //       }
    //     } else {
    //       item.ID = `${index + 1} `
    //     }
    //     if (item.children.length > 0) this.transformData(item.children, `${item.ID}.`)
    //   })
    // },
    initData () {
      this.tableData = this.originData.map(res => {
        res.warehouseItem.forEach(item => {
          res[item.warehouseId] = item
        })
        return res
      })
      this.originData[0].warehouseItem.forEach((res) => {
        this.colData.push({
          dataItem: res.warehouseId,
          dataName: res.warehouseName
        })
      })
    },
    exportList () {
      const wscols = [
        { wpx: 220 } // 第一列宽度设置单位px
      ]
      /**
       * 合并单元格元素(decode_range方法解析数据格式)
       {
          s: { //s start 开始
            c: 1,//cols 开始列
            r: 0 //rows 开始行
          },
          e: {//e end  结束
            c: 4,//cols 结束列
            r: 0 //rows 结束行
          }
        }
        TODO:纯手动创建的worksheet
       */
      const wsMerge = [XLSX.utils.decode_range('A1:A2')]
      /** 头部-行列信息 */
      const header1 = this.colData.map(res => res.dataName).concat('合计')

      header1.map((res, idx, array) => {
        const hdMergeObj = {
          s: { r: 0 },
          e: { r: 0 }
        }
        if ((idx + 2) % 1 === 0) {
          array.splice(3 * idx + 1, 0, '', '')
          hdMergeObj['s']['c'] = 3 * idx + 1
          hdMergeObj['e']['c'] = hdMergeObj['s']['c'] + 2
          wsMerge.push(hdMergeObj)
        }
        return res
      })
      const header2 = this.colData.map(() => '库存数量').concat('库存数量')
      header2.map((res, idx, array) => {
        if ((idx + 2) % 1 === 0) {
          array.splice(3 * idx + 1, 0, '锁定数量', '可用数量')
        }
        return res
      })
      // 创建worksheet并插入的2个表头,被合并的地方用''
      const ws = XLSX.utils.aoa_to_sheet([
        ['商品信息'].concat(header1),
        [''].concat(header2)
      ])
      console.log('header1', ['商品信息'].concat(header1))
      console.log(header2)
      /** 商品信息-行列信息 */
      const skuInfo = this.tableData.map(res => res.skuId + '\r\n' + res.skuName)
      // 向A3也就是第三行第一列插入数据
      XLSX.utils.sheet_add_aoa(ws, skuInfo.map(res => [res]), { origin: 'A3' })
      /** 仓库-行列信息（库存数量，锁定数量，可用数量） */
      const unAllowed = ['skuId', 'skuName', 'warehouseItem']
      const sheetData = this.tableData.map((data) => {
        const filterItem = Object.assign({}, data)
        Object.keys(filterItem)
          .filter(key => unAllowed.includes(key))
          .forEach(key => delete filterItem[key])
        // 重构完数据
        let warehouseDatas = []
        Object.values(filterItem).forEach(res => {
          warehouseDatas = warehouseDatas.concat([res.quantity]).concat([res.lockQuantity]).concat([res.availableQuantity])
          return warehouseDatas
        })
        return warehouseDatas
      })
      console.log('sheetData', sheetData)
      // 向ws工作表的3行2列插入数据
      XLSX.utils.sheet_add_aoa(ws, sheetData, {
        origin: { r: 2, c: 1 }
      })
      /** 合计-行列信息 */
      const totalData = this.tableData.map(row => {
        const totlalQuantity = Object.values(row.warehouseItem).map(res => res.quantity).reduce((accumulator, currentValue) => accumulator + currentValue)
        const totlalLockQuantity = Object.values(row.warehouseItem).map(res => res.lockQuantity).reduce((accumulator, currentValue) => accumulator + currentValue)
        const totlalAvailableQuantity = Object.values(row.warehouseItem).map(res => res.availableQuantity).reduce((accumulator, currentValue) => accumulator + currentValue)
        return [totlalQuantity, totlalLockQuantity, totlalAvailableQuantity]
      })
      console.log('total', totalData, this.colData.length * 3 + 1)
      // 向ws工作表的3行10列插入数据
      XLSX.utils.sheet_add_aoa(ws, totalData, {origin: { r: 2, c: this.colData.length * 3 + 1 }})
      // 导出
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      ws['!cols'] = wscols
      // wsMerge.push(XLSX.utils.decode_range('B1:D1')) // 测试数据 仓库1模拟数据
      ws['!merges'] = wsMerge
      console.log(wsMerge, wb)
      // XLSX.writeFile(wb, '库存报表按SKU.xlsx')
    },

    // 下载,json数据转excel
    downloadExcel (json) {
      this.changeToExcel(json, '星期文件')
    },
    // json数据转excel
    changeToExcel (json, excelName = 'out') {
      json = XLSX.utils.json_to_sheet(json)
      var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      wb.Sheets['Sheet1'] = json
      // 创建一个工作薄对象，打印出来可以看到有数组SheetNames 存放表格里面多张表的名字， Sheets对象存放对应表名的
      // let wb = XLSX.utils.book_new()
      // console.log(wb)
      XLSX.writeFile(wb, `${excelName}.xlsx`)
    },

    // 字符串转二进制字符流
    s2ab (s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    },
    // 上传文件
    loadExcel (e) {
      console.log(e.target.files)
      if (e.target.files.length === 0) {
        for (let key in this.uploadFile) {
          this.uploadFile[key] = ''
        }
        return
      }
      let file = e.target.files[0]
      this.uploadFile.name = file.name
      this.uploadFile.alias = file.name.substring(0, file.name.lastIndexOf('.'))
      this.uploadFile.extension = file.name.substring(file.name.lastIndexOf('.'))
      this.uploadFile.time = file.lastModified // 时间戳
      this.uploadFile.size = file.size
      this.uploadFile.file = file
      // 选择文件后，读取excel表格内的数据
      this.getExcelData()
    },
    // 读取excel表格内的数据,导出json格式
    getExcelData () {
      let workbook
      const rgx = '(.txt|.TXT|.csv|.CSV|.xlsx|.XLSX|.xls|.XLS)$'
      const re = new RegExp(rgx)
      const check = re.test(this.uploadFile.file.name)
      if (!check) {
        console.error('导入文件格式只能为txt、csv、xlsx格式')
        return
      }

      const reader = new FileReader()
      // 读取文件过程方法
      reader.onloadstart = function (e) {
        console.log('开始读取....')
      }
      reader.onprogress = function (e) {
        console.log('正在读取中....')
      }
      reader.onabort = function (e) {
        console.log('中断读取....')
      }
      reader.onerror = function (e) {
        console.log('读取异常....')
      }
      reader.onload = function (e) {
        console.log('成功读取....')
        // EXCEL
        workbook = XLSX.read(e.target.result, { type: 'binary' })
        this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1)
        console.log(this.excelData)
      }
      reader.readAsBinaryString(this.uploadFile.file)
    }
  }
}
</script>

<style scoped>

</style>
