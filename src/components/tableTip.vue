
<template>
    <div class="my-table">
       <el-table
    
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width:1000px"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      label="日期"
      width="120">
      <template slot-scope="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip>
    </el-table-column>
  <el-table-column
     
      label="操作"
      show-overflow-tooltip>
       <template slot-scope="scope">
        <el-button
        
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        
      </template>
    </el-table-column>
  </el-table>
    <h1>{{name}}</h1>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="total">
</el-pagination>
<div style="">
  sasasa
</div>

    </div>
</template>
<script>
export default {
  data() {
    return {
      multipleSelection: []
    }
  },
  props: ["tableData", "total", "name"],
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="less" >
.my-table {

  .el-table {
     overflow: visible;
    &::before {
      height: 0;
    }
    .el-table__body-wrapper {
      overflow: visible;
      table.el-table__body {
        border-collapse: collapse;
        tr {
          border: 1px solid black;

          td {
            border: 0;
           
          }
        }
        tr:hover {
          td {
            border-top: 1px solid red;
            border-bottom: 1px solid red;
            &:nth-child(1) {
              border-left: 1px solid red;
            }
            &:nth-last-child(1) {
              border-right: 1px solid red;
            }
            button {
              background: darkkhaki;
              &:hover {
                background: red;
              }
            }
          }
        }
      }
    }
  }
}
</style>
