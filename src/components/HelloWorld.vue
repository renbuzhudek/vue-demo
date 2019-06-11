<template>
  <div>
    <custom-input v-model="msg" :name="{name:'武汉'}">小明去上学吧</custom-input>
      <vm-input :num.sync="number" :width="30"></vm-input>
   <button @click="btnClick">懒加载</button>
    <input type="checkbox" :value="msg" v-model="text" @change="changes($event)"/>JIM
</div>
</template>

<script>
import { mapState } from 'vuex'
import vmInput from './input'
import customInput from './customInput'
export default {
  name: 'HelloWorld',
  data () {
    return {
      text: true,
      msg: 'aasaSS ',
      number: 21,
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
      ]
    }
  },
  mounted () {
    this.$parent.$emit('hello', '触发')
  },
  computed: {
    ...mapState({
      firstName: state => state.name
    })
  },

  methods: {
    changes (e) {
      console.log(e)
    },
    btnClick (e) {
      return import(/* webpackChunkName: "print" */ './print').then(module => {
        module.a()
      })
    }
  },
  components: {
    vmInput,
    customInput
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
