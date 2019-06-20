<template>
  <div id="app">
  <button @click="$router.push({path:'/'})">第一页</button>
  <button  @click="$router.push({name:'ttttt',params: { userId: '123' }})">第二1页</button>
   <button  @click="$router.push({path:'/select/111'})">第三页</button>
      <button  @click="$router.push({path:'/selects'})">第4页</button>
 <button @click="$router.push({path:'/demoRx'})">RX测试</button>

<button @click="changes">点击</button>
 <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      ddd: 1,
      values: false,
      name: [
        {
          inputterId: 232,
          billMoney: '200',
          remark: '打车钱',
          inputterName: '凌波天堂制冷设备有限公司7560',
          typechange: true,

          inputerror: false,
          moneyerror: false,
          fbillMoney: '200'
        },
        {
          inputterId: '',
          inputterName: '',
          typechange: true,
          billMoney: '300',
          remark: '做飞机',
          fbillMoney: '300',
          moneyerror: false
        }
      ]
    }
  },
  mounted () {
    this.$on('hello', (e) => {
      console.log(e)
    })
  },
  watch: {
    values (newValue, oldValue) {
      if (newValue) {
        this.ddd += 1
      }
    }
  },
  methods: {
    changes () {
      this.values = !this.values
    }
  }
}
</script>

<style scoped >
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
