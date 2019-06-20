<template>
    <div>
<button @click="downloadExcel">下载excel</button>
<input type="file" @change="loadExcel"/>
    </div>
</template>

<script>
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
      excelData: {}
    }
  },
  methods: {
    // 下载,json数据转excel
    downloadExcel () {
      let json = [ {
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
      }]
      this.changeToExcel(json, '星期文件')
    },
    // json数据转excel
    changeToExcel (json, excelName) {
      const _this = this
      json = XLSX.utils.json_to_sheet(json)
      const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' }
      var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }
      wb.Sheets['Sheet1'] = json
      let tmpDown = new Blob([_this.s2ab(XLSX.write(wb, wopts))], { type: '' })

      const aDom = document.createElement('a')
      aDom.download = `${excelName || '数据文件'}.xlsx`
      aDom.href = window.URL.createObjectURL(tmpDown)
      aDom.click()
      setTimeout(function () {
        URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
      }, 100)
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
