<template>
  <div>
    <button @click="buttonClick">获取</button>
    <input
    class="input"
    ref="button"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
   <h1>{{value}}</h1>
   <h2>{{name.name}}</h2>
   <slot></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    value: '',
    name: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    console.log('slot', this.$slots, this)
  },
  updated () {
    console.log('updated::::', this.$props)
  },
  methods: {
    buttonClick () {
      document.querySelector('.input').focus()
      // this.$refs.button.focus();
      setTimeout(() => {
        this.$refs.button.blur()
      }, 1000)
    }
  }
}
</script>
<style>
</style>
