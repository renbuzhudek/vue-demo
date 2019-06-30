import Vue from 'vue'
let timers = null
let TipsConstructor = Vue.extend({
  name: 'tips',
  template: `
    <div v-show="open" style="position:fixed;background-color:rgba(123,223,45,0.3);left:50%;top:100px;">
    <p>我的名字：{{name}}</p>
    <slot>
    <p v-html="message"></p>
    </slot>
    </div>
    `,
  data () {
    return {
      open: false,
      name: '',
      message: '',
      timer: null
    }
  },
  mounted () {
    timers = setTimeout(() => {
      this.open = false
    }, 3000)
  },
  updated () {
    // console.log('updated:::', this.$data)
  },
  destroyed () {
    clearTimeout(timers)
    timers = null
  },
  methods: {

  }

})

const tips = function (options) {
  let instance = new TipsConstructor({
    data: options
  })
  if ((instance.message) instanceof Object) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }
  instance.open = true
  document.body.appendChild(instance.$mount().$el)
}
export default tips
