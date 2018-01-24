<template lang="html">
  <div class="header">
    <div @click="freshPosts" class="logo"></div>
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
    freshPosts() {
      this.$emit('freshPosts');
    }
  }
}
</script>

<style lang="css">
.header {
  position: fixed;
  top: 0%;
  width: 100%;
  height: 100px;
  background: #fff;
  z-index: 99;
  box-shadow: 0px 5px 30px 20px #fff;
}
.logo {
  display: inline-block;
  float: left;
  margin: 2rem 2rem 0 5rem;
  height: 50px;
  width: 100px;
  background-repeat: no-repeat;
  background-image: url('../assets/logo.jpg');
  cursor: pointer;
}
.burger {
  display: inline-block;
  float: right;
  margin: 2rem 5rem 0 2rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
