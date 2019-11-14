function funFocus () {
  this.classList.remove('is-danger')
}
/** table行内编辑校验，有红框和message错误提示，使用方法见tableDemo.vue */
export default {
  data () {
    return {
      validateMode: [] // 收集需要校验的表单
    }
  },
  directives: {
    validate: {
      bind: function (el, binding, vnode) {
        let {rule, prop} = binding.value
        let input = el.querySelector('input')
        vnode.context.validateMode.push({el: input, rule, prop})
        input.addEventListener(
          'focus',
          funFocus
        )
      },

      unbind: function (el, binding, vnode) {
        let input = el.querySelector('input')
        input.removeEventListener('focus', funFocus)
        vnode.context.validateMode = vnode.context.validateMode.filter(item => item.el !== input)
      }
    }
  },
  methods: {
    validate (data, index) {
      let bol = true
      this.validateMode.map(item => {
        let arr = item.prop.match(/(\d*?)\.(.*)/)
        let i = Number(arr[1]); let filed = arr[2]
        if (index !== i) return
        for (let rule of item.rule) {
          if (rule.required && !data[filed]) {
            bol = false
            item.el.classList.add('is-danger')
            this.$message.error(rule.message)
            return
          }
          rule.validator && rule.validator(data[filed], res => {
            if (res) return
            bol = false
            item.el.classList.add('is-danger')
            this.$message.error(rule.message)
          })
        }
      })
      return Promise.resolve(bol)
    }
  }
}
