<template>
    <div>

        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">

 <div  v-for="(item, index) in dynamicValidateForm.list"
  :key="index">

      <el-form-item

    :label="'选择' "

    :prop="'list.' + index + '.selectVal'"
    :rules="{
      required: true, message: '请选择', trigger:[ 'blur','change']
    }">
         <el-select
         @focus="focusIndex(index)"
         @change="changeselect"
         :remote-method="remoteMethod"
          :loading="loading"
           remote
            v-model="item.selectVal"
            filterable placeholder="请选择"
            >
    <el-option
      v-for="item in options4"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

  </el-form-item>

        <el-form-item
    size="small"
    :label="'域名' + index"

    :prop="'list.' + index + '.money'"
    :rules="[{
      required: true, message: '请输入金额', trigger: 'submit'
    }]"
  >
    <el-input v-model="item.money"  clearable @change="initMoney" @blur="blurMoney" @keyup.native="keyuphandle"></el-input>

  </el-form-item>
   <el-button @click.prevent="removeDomain(index)">删除</el-button>
 </div>

  <el-form-item>
    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    <el-button @click="addDomain">新增</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
</el-form>
    </div>
</template>

<script>
// 保留小数点2位
var textfix = function (nnumber) {
  var newnumber = nnumber.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return newnumber
}

var fmoney = function (ATR) {
  let str = String(ATR)
  let count = 0
  let newStr = ''
  if (str === '') {
    return ''
  }
  if (str.indexOf('.') === -1) {
    str = String(parseFloat(str.replace(/[^d.-]/g, '')))
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
  } else {
    str = String(str.replace(/[^d.-]/g, ''))
    if (str.indexOf('.') - 1 < 0) {
      newStr = ATR
    } else {
      for (let i = str.indexOf('.') - 1; i >= 0; i--) {
        if (count % 3 === 0 && count !== 0) {
          newStr = str.charAt(i) + ',' + newStr
        } else {
          newStr = str.charAt(i) + newStr // 逐个字符相接起来
        }
        count++
      }
    }
    let sint = (str + '00').substr((str + '00').indexOf('.'), 3)
    if (sint === '0') {
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
export default {
  data () {
    return {
      myIndex: '',
      options4: [],
      list: [],
      loading: false,
      states: ['Alabama', 'Alaska', 'Arizona',
        'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida',
        'Georgia', 'Hawaii', 'Idaho', 'Illinois',
        'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana',
        'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas',
        'Utah', 'Vermont', 'Virginia',
        'Washington', 'West Virginia', 'Wisconsin',
        'Wyoming'],

      dynamicValidateForm: {
        list: [
          {selectVal: '', money: ''}
        ]
      }
    }
  },
  mounted () {
    this.list = this.states.map((item, index) => {
      return { value: index, label: item }
    })
  },
  methods: {
    focusIndex (index) {
      this.myIndex = index
    },
    keyuphandle (val) { // 监听keyup事件获取输入框的值
      let money = val.target.value// 缓存输入框的值

      if (isNaN(val.target.value)) {
        val.target.value = ''// 如果输入的不是数字，置空
      } else {
        money = textfix(money)// 给金额保留2位小数
        let filterMoney = fmoney(money) // 加逗号
        console.log(filterMoney)
        val.target.value = filterMoney
        console.log(textfix(filterMoney))
      }
    },
    initMoney (val) {
      console.log('输入改变:::' + val)
    },
    blurMoney (val) {
      console.log('失去焦点:::' + val)
    },
    changeselect (val) {
      // this.dynamicValidateForm.list[this.myIndex].selectVal=val;
      console.log(val)
    },
    remoteMethod (query) {
      console.log(query)
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },
    selectVal (val) {
      console.log(val)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain (index) {
      this.dynamicValidateForm.list.splice(index, 1)
    },
    addDomain () {
      this.dynamicValidateForm.list.push({selectVal: '', money: ''})
    }
  }
}
</script>
