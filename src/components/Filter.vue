<template lang="html">
  <div class="categories">
    <ul class="categories__list">
      <li @click="getCategory('home')" class="categories__item">All</li>
      <li @click="getCategory(2)" class="categories__item">Photography</li>
      <li @click="getCategory(1)" class="categories__item">Troubled Mind</li>
      <li class="categories__item">Read Watch Listen</li>
      <li class="categories__item">Something Made</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    getCategory(id) {
      console.log('i dont work yet' + id + '');
    }
  }
}
</script>

<style lang="css">
</style>
