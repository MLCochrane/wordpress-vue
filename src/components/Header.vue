<template lang="html">
  <div class="header">
    <div @click="headHome" class="logo"></div>
    <div class="burger">
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 31">
        <title>burg</title>
        <rect width="33" height="6" rx="2" ry="2" style="fill: #231f20"/>
        <rect y="10" width="33" height="6" rx="2" ry="2" style="fill: #231f20"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    headHome() {
      this.$emit('headHome');
    }
  }
}
</script>
