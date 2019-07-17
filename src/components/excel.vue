<template>
    <div>
<button @click="downloadExcel(json)">下载excel</button>
<!-- <button @click="downloadExcel">下载树形结构excel</button> -->
<input type="file" @change="loadExcel"/>
    </div>
</template>

<script>
// import treeData from './mock-tree.json'
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
      },
      {
        '星期一': '123456789',
        '星期二': '123456789',
        '星期三': '123456789'
      },
      {
        '星期一': '123456789',
        '星期二': '123456789',
        '星期三': '123456789'
      }],
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
      const ws = XLSX.utils.aoa_to_sheet([
        ['商品信息'].concat(header1),
        [''].concat(header2)
      ])
      // console.log('header1', ['商品信息'].concat(header1))
      // console.log(header2)
      /** 商品信息-行列信息 */
      const skuInfo = this.tableData.map(res => res.skuId + '\r\n' + res.skuName)
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
      // console.log('sheetData', sheetData)
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
      // console.log('total', totalData, this.colData.length * 3 + 1)
      XLSX.utils.sheet_add_aoa(ws, totalData, {origin: { r: 2, c: this.colData.length * 3 + 1 }})
      // 导出
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      ws['!cols'] = wscols
      // wsMerge.push(XLSX.utils.decode_range('B1:D1')) // 测试数据 仓库1模拟数据
      ws['!merges'] = wsMerge
      console.log(wsMerge, wb)
      XLSX.writeFile(wb, '库存报表按SKU.xlsx')
    },

    // 下载,json数据转excel
    downloadExcel (json) {
      this.changeToExcel(json, '星期文件')
    },
    // json数据转excel
    changeToExcel (json, excelName) {
      json = XLSX.utils.json_to_sheet(json)
      var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      wb.Sheets['Sheet1'] = json
      // 创建一个工作薄对象，打印出来可以看到有数组SheetNames 存放表格里面多张表的名字， Sheets对象存放对应表名的
      // let wb = XLSX.utils.book_new()
      // console.log(wb)
      XLSX.writeFile(wb, 'out.xlsx')
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
      const _this = this
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
        _this.workbook = XLSX.read(e.target.result, { type: 'binary' })
        this.excelData = XLSX.utils.sheet_to_json(_this.workbook.Sheets.Sheet1)
        console.log(this.excelData)
      }
      reader.readAsBinaryString(this.uploadFile.file)
    }
  }
}
</script>

<style scoped>

</style>
