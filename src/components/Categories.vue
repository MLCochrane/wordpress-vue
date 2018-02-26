<template lang="html">
  <div class="categories">
    <ul class="categories__list">
      <li @click="getCategory('')" class="categories__item">All</li>
      <li @click="getCategory(6)" class="categories__item">Photography</li>
      <li @click="getCategory(7)" class="categories__item">Troubled Mind</li>
      <li @click="getCategory(9)" class="categories__item">Read Watch Listen</li>
      <li @click="getCategory(8)" class="categories__item">Something Made</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    getCategory(id) {
      this.$emit('getCategory', id);
    }
  }
}
</script>
