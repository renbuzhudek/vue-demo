<template>
 <div>
   <i class="fa fa-address-book" aria-hidden="true"></i>
   <div style="height:10px;width:200px;">
      8 <i class="fa fa-car"></i>
 9 <i class="fa fa-car" ></i>
10 <i class="fa fa-car" ></i>
   </div>
   <div>sdds</div>
    <el-table

    ref="multipleTable"
    :data="tableData3"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
     align="left"
      type="selection"
      width="55">
    </el-table-column>
 <el-table-column
  sortable
 align="left"

v-for="(item,index) in tableHead"
:key="index"
:prop="item['data']"
:label="item['label']"

 >
 </el-table-column>
 <el-table-column label="姓名">
<template slot-scope="{row,$index}">
<el-input v-if="row.editing" v-validate="{rule:ruleName,prop:`${$index}.name`}"   v-model="row.name"></el-input>
<span v-else>{{row.name}}</span>
</template>
</el-table-column>
<el-table-column label="地址">
<template slot-scope="{row,$index}">
<el-input v-if="row.editing" v-validate="{rule,prop:`${$index}.address`}"   v-model="row.address"></el-input>
<span v-else>{{row.address}}</span>
</template>
</el-table-column>
    <el-table-column
     align="left"
      label="操作"
      show-overflow-tooltip>
<template slot-scope="{row,$index}">
  <el-button size="mini" v-if="row.editing" @click="save(row,$index)">保存</el-button>
  <el-button size="mini" v-if="row.editing"  @click="row.editing=false">取消</el-button>
  <el-button
   v-if="!row.editing"
          size="mini"
          @click="operation(row)">{{action}}</el-button>
            <el-button
            v-if="!row.editing"
          size="mini"
          @click="edit(row)">编辑</el-button>
  </template>
    </el-table-column>
  </el-table>
  <div style="float:left;">
    <el-button @click="toggleSelection(tableData3)">全选</el-button>
    <el-button @click="exportdata()">导出数据</el-button>
  </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="sizes, prev, pager, next"
      :total="1000">
    </el-pagination>
 </div>
</template>

<script>
import tableTip from '../components/tableTip.vue'
import tableValidate from '@/mixins/tableValidate'

export default {
  components: {
    'v-table-tip': tableTip
  },
  mixins: [tableValidate],
  data () {
    const checkChart = (value, callback) => {
      if (value.length < 5) return callback()
      // eslint-disable-next-line standard/no-callback-literal
      callback(true)
    }
    return {
      action: '转让',
      currentPage: 1, // 默认当前页
      tableHead: [{data: 'date', label: '日期'}],
      tableData3: [ // 数据源
        {
          date: '2016-05-19',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          editing: false
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          editing: false
        },
        {
          date: '2016-05-10',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          editing: false
        }
      ],
      multipleSelection: [], // 被选中行的数据
      allSelect: false,
      rule: [{
        required: true,
        message: '地址不能为空'
      },
      {
        message: '地址长度必须大于5个字符',
        validator: checkChart
      }],
      ruleName: [{
        required: true,
        message: '姓名不能为空'
      },
      {
        message: '姓名长度必须大于5个字符',
        validator: checkChart
      }]
    }
  },
  mounted () {
    console.log($(document))
  },
  methods: {
    save (row, index) {
      this.validate(row, index).then(
        res => {
          if (!res) return false
          row.editing = false
        }
      )
    },
    edit (row) {
      row.editing = true
    },
    post (url) {
      console.log(url)
    },
    operation (data) { // 操作事件,当前行数据
      this.$emit('operation', data)
    },
    exportdata () {
      this.$emit('exportdata', this.multipleSelection)// 导出选中行的数据
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
        })
        this.allSelect = !this.allSelect
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(val);
    },
    handleSizeChange (val) {
      this.$emit('sizeChange', val)
      console.log(`每页 ${val} 条`)// 页面size改变时回调
    },
    handleCurrentChange (val) {
      this.$emit('currentChange', val)
      console.log(`当前页: ${val}`) // 页码改变时回调
    }
  }

}
</script>

<style>
.is-danger{
  border:1px solid red !important;
}
</style>
