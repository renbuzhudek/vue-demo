<template>
  <div>
    <custom-input v-model="msg" :name="{name:'武汉'}" ><h2>明天小明不上学！</h2></custom-input>
      <vm-input :num.sync="number" :width="30"></vm-input>
   <button @click="btnClick">懒加载</button>
   <v-excel/>
    <input type="checkbox" :value="msg" v-model="text" @change="changes($event)"/>JIM
</div>
</template>

<script>
import tips from './tips/tips'
import { mapState } from 'vuex'
import vmInput from './input'
// import customInput from './customInput'
import vExcel from './excel'
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
      const h = this.$createElement
      let vnode = h('div', {}, [
        h('h2', {}, '你的微笑，'),
        h('p', {}, '我明白就很好！')
      ])
      // console.log(this)
      tips({
        type: 'success',
        name: '郑治益',
        message: vnode
      })
      return import(/* webpackChunkName: "print" */ './print').then(module => {
        // module.a()
      })
    }
  },
  components: {
    vmInput,
    'custom-input': () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let com = import('./customInput')
          resolve(com)
        }, 0)
      })
    },
    vExcel
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
