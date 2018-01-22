<template lang="html">
  <div class="header">
    <div class="logo"></div>
  </div>
</template>

<script>
export default {
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
  margin: 2rem;
  height: 50px;
  width: 100px;
  background-repeat: no-repeat;
  background-image: url('../assets/logo.jpg');
}
</style>
