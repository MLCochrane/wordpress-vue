<template lang="html">
  <div class="categories">
    <ul class="categories__list">
      <li @click="changeGategory('')" class="categories__item">All</li>
      <li @click="changeGategory(6)" class="categories__item">Photography</li>
      <li @click="changeGategory(7)" class="categories__item">Troubled Mind</li>
      <li @click="changeGategory(9)" class="categories__item">Read Watch Listen</li>
      <li @click="changeGategory(8)" class="categories__item">Something Made</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    changeGategory(id) {
      let el = document.getElementsByClassName('posts-feed');
      let footer = document.getElementsByClassName('footer');
      let tl = new TimelineMax;

      tl
      .to([el,footer], .5, {autoAlpha: 0, onComplete: () => {
        this.$store.dispatch('CHANGE_CATEGORY', {id: id});
      }}, 0)
      .to([el,footer], .5, {autoAlpha: 1}, 1.75);

      // Would stay at same scroll position when switching between different categories
      window.scrollTo( 0, 0 );
    },
  }
}
</script>