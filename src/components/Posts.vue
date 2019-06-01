<template>
  <transition
    mode="out-in"
    :css="false"
    v-on:appear="appear"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <div class="posts-feed">
      <app-categories @getCategory="getCategory(...arguments)"></app-categories>
      <template v-if="isLoaded">
        <div class="posts-feed__post" v-for="(proj, index) in getPosts" :key=index>
          <div class="posts-feed__wrap">
            <img class="posts-feed__image" :src="proj | getImage" :alt="proj | getAlt">
          </div>
          <div class="posts-feed__details">
            <h2 @click="goTo(proj.slug)" @mouseover="active" @mouseleave="active" class="posts-feed__title">{{ proj.title.rendered }}</h2>
            <p class="posts-feed__count">{{ index | addOne }}</p>
            <p class="posts-feed__date">{{ proj.date | stripDate }}</p>
            <p class="posts-feed__category">{{ proj.categories[0] | categoryTitle }}</p>
          </div>
      </div>
      </template>

    <app-pagination></app-pagination>
    <div class="home-overlay">
      <p class="home-overlay__title home-overlay__title--top">Useless By Design</p>
      <p class="home-overlay__title home-overlay__title--bottom">A home for busy thoughts, photography, culture and creation.</p>
    </div>
  </div>
</transition>

</template>

<script>
import {TweenMax, Power3, Bounce, Timeline} from "gsap";
import {mapGetters} from 'vuex';

import Categories from './Categories.vue';
import Pagination from './Pagination.vue';

export default {
  name: 'Posts',
  props: ['isLoaded'],
  components: {
    appCategories: Categories,
    appPagination: Pagination,
  },
  data() {
    return {
      postWasClicked: false,
    }
  },
  methods: {
    goTo(proj) {
      let toRemove = document.querySelectorAll('.posts-feed > .posts-feed__post > .posts-feed__details');
      let filterToRemove = document.getElementsByClassName('categories')[0];
      let image = document.getElementsByClassName('active');
      let distanceY = -1 * (document.documentElement.clientHeight / 2);

      let tl = new TimelineMax;

      this.postWasClicked = true;

      tl
      .to([toRemove, filterToRemove], 1, {opacity: 0},0)
      .call(this.intoPost, [proj], 1);
    },
    intoPost(proj) {
      this.$router.push({ name: 'Post', params: { postSlug: proj }});
    },
    active(event) {
      const details = event.target.parentElement;

      const image = details.previousElementSibling;
      const meta = details.querySelector('.posts-feed__date');
      const category = details.querySelector('.posts-feed__category');

      // This check removes the flashing of the featured image if the user moves mouse off title while transition happens
      if (this.postWasClicked == false) {
        image.classList.toggle('active');
        meta.classList.toggle('posts-feed__date--active');
        category.classList.toggle('posts-feed__category--active');
      }
    },
    appear() {
      let overlay = document.getElementsByClassName('home-overlay');
      let top = document.getElementsByClassName('home-overlay__title--top');
      let bottom = document.getElementsByClassName('home-overlay__title--bottom');
      let tl = new TimelineMax;

      tl
        .from(top, .5, {autoAlpha: 0}, 0)
        .from(bottom, .5, {autoAlpha: 0}, 1.25)
        .fromTo(overlay, 1, {autoAlpha: 1}, {autoAlpha: 0}, 5);
    },
    enter(el, done) {
      let one = document.getElementsByClassName('cover__one');
      let btn = document.getElementsByClassName('pagination');

      let tl = new TimelineMax;
      tl
      .to(one, .75, {width: '130%'}, 0)
      .to(one, .75, {width: '0%'}, 1)
      .fromTo(btn, 1, {autoAlpha: 0}, {autoAlpha: 1}, 1)
      .fromTo(el, 1, {autoAlpha: 0}, {autoAlpha: 1, onComplete: done}, .5)
    },
    leave(el, done) {
      let wrap = el.getElementsByClassName('posts-feed__wrap');
      let image = el.getElementsByClassName('posts-feed__image');
      let one = document.getElementsByClassName('cover__one');

      let tl = new TimelineMax;
      tl
        .to(wrap, 1, {scale: 0.75}, 0)
        .to(image, .35, {opacity: '1'}, 0)
        .to([one], .75, {width: '130%'}, 0.25)
        .fromTo(el, .5, {autoAlpha: 1}, {autoAlpha: 0, onComplete: done}, 1)
        .to([one], .75, {width: '0%'}, 1.5);
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.query.fresh && vm.$route.query.fresh === true) vm.$store.dispatch('FETCH_POSTS', {fresh: true});
      next();
    });
  },
  computed: {
    ...mapGetters([
      'getPosts',
      'isFetching',
    ])
  },
  filters: {
    addOne(string) {
      // Simply to have post numbers start at 1 and not 0
      return string + 1;
    }
  }
}
</script>