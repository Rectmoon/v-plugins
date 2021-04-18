<template>
  <div class="v-slect-page">
    SelectPage
  </div>
</template>

<script>
import { h as V } from 'vue'
export default {
  mounted () {
    console.log({ V })
    console.log({
      SelectPage: this.$slots.default
    })
  }
}
</script>

<style>
</style>
