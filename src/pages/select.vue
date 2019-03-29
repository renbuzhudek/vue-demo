<template>
<div>
    <el-select v-model="value8" filterable placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
<input type="" @click="handle">
<div style="width:50vw;height:1rem;background-color:blue;"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value8: ''
    }
  },
  methods: {
    handle (e) {
      console.log(e.target.value)
    }
  },
  mounted () {
    console.log(this.$route)
  }

}
</script>
<style scoped>

</style>
