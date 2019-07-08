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

    <el-table-column
     align="left"
      label="操作"
      show-overflow-tooltip>
<template slot-scope="scope">
  <el-button
          size="mini"
          @click="operation(scope.row)">{{action}}</el-button>
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
export default {
  components: {
    'v-table-tip': tableTip
  },
  data () {
    return {
      action: '转让',
      currentPage: 1, // 默认当前页
      tableHead: [{data: 'date', label: '日期'}, {data: 'name', label: '姓名'}, {data: 'address', label: '地址'}], // 设置表头
      tableData3: [ // 数据源
        {
          date: '2016-05-19',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-10',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: [], // 被选中行的数据
      allSelect: false
    }
  },
  mounted () {
    console.log($(document))
  },
  methods: {
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

</style>
