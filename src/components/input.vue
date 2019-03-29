<template>
  <div>
    <button  @click="changecolor()">点击</button>
    <h1>{{num}}</h1>
  </div>
</template>
<script>
export default {
  data () {
    return {
      widths: this.width
    }
  },
  props: {
    num: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    }
  },
  methods: {

    changecolor () {
      this.$emit('update:num', this.num + 1)
    }
  }
}
</script>
<style>
</style>
