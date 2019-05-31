<template lang="html">
  <transition
    appear
    mode="out-in"
    :css="false"
    v-on:appear="customAppearHook"
    v-on:enter="enter"
    v-on:before-leave="beforeLeave"
    v-on:leave="leave"
  >
    <div class="post">
      <div class="post__intro" v-if="isLoaded">
        <div class="post__container post__container--left">
          <img class="post__featured" :src="currentPost | getImage" :alt="currentPost | getAlt">
        </div>
        <div class="post__container post__container--right">
          <div class="post__title">
            <h1>{{ current.title.rendered }}</h1>
          </div>
          <div class="post__meta">
            <hr class="post__rule">
            <p class="post__heading post__heading--top">{{ current.date | stripDate }}</p>
            <p class="post__heading">{{ current.category | categoryTitle }}</p>
          </div>
        </div>
      </div>
      <div class="post__content">
        <div v-html="current.content.rendered"></div>
      </div>
      <div class="bottom">
        <div v-if="this.mostRecent.title" class="bottom__component">
          <p class="bottom__title">Recent Post</p>
          <hr class="post__rule">
          <p class="bottom__link" @click="nextPost(mostRecent.slug)">{{ this.mostRecent.title.rendered }}</p>
        </div>
        <div v-else class="bottom__component">
          <p class="bottom__title">No recent post available</p>
        </div>
        <div v-if="relatedPosts.length" class="bottom__component">
          <p class="bottom__title">Related Posts</p>
          <hr class="post__rule">
          <p class="bottom__link" @click="nextPost(proj.slug)" v-for="proj in relatedPosts">{{ proj.title.rendered }}</p>
        </div>
        <div v-else class="bottom__component">
          <p class="bottom__title">No related posts available</p>
        </div>
      </div>
      <div @click="scrollToTop" class="post__scroll-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46">
          <title>ArrowUp</title>
          <circle cx="23" cy="23" r="23" style="fill: #231f20"/>
          <g>
            <polygon points="23 10 26 13 40 28 37 31 23 16 9 31 6 28 20 13 23 10" style="fill: #fff"/>
          </g>
        </svg>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  props: ['isLoaded'],
  data() {
    return {
      currentPost: [],
      relatedPosts: [],
      mostRecent: '',
      current: {
        title: '',
        date: '',
        category: '',
        content: ''
      },
      type: '/posts/' //not sure if this helps with D.R.Y at all
    }
  },
  methods: {
    getThisPost(switchedPost) {
      let destinationSlug = '';
      if (switchedPost) {
        destinationSlug = switchedPost.path.slice(this.type.length);
      } else {
        destinationSlug = this.$route.path.slice(this.type.length);
      }
      // Makes request for specifc post that wasn't found in posts array
      this.$store.dispatch('FETCH_SINGLE', {slug: destinationSlug});
    },
    fillPost(thisPost) {
      this.currentPost = thisPost;
      this.current.title = thisPost.title;
      this.current.content = thisPost.content;
      this.current.date = thisPost.date;
      this.current.category = thisPost.categories[0];

      console.log(this.getRelated(this.current.category, this.currentPost.id));
    },
    nextPost(proj) {
      let el = document.getElementsByClassName('post');
      let tl = new TimelineMax;

      tl
      .to(el, .5, {autoAlpha:0},0)
      .call(this.goTo, [proj], .5)
      .to(el, .5, {autoAlpha: 1}, 1.5);
    },
    goTo(proj) {
      this.$router.push({ name: 'Post', params: { postSlug: proj }});
    },
    scrollToTop() {
      let el = document.getElementsByClassName('post__content')[0];
      TweenMax.to(window, 1, {scrollTo: 0});
    },
    customAppearHook(el) {
        let title = el.getElementsByClassName('post__title');
        let content = el.getElementsByClassName('post__content');
        let meta = el.getElementsByClassName('post__meta');

        let tl = new TimelineMax;
        tl
        .from(title, 1, {x: 300, opacity: 0})
        .from([content,meta], 1, {opacity: 0});
    },
    // the done callback is optional when
    // used in combination with CSS
    enter(el, done) {
      let image = el.getElementsByClassName('post__featured')[0];
      let title = el.getElementsByClassName('post__title');
      let content = el.getElementsByClassName('post__content');
      let meta = el.getElementsByClassName('post__meta');
      let tl = new TimelineMax;

      tl
      .from(image, .5, {opacity: 0}, 1)
      .fromTo(title, 1, {opacity: 0}, {opacity: 1}, 2)
      .fromTo([content, meta], 1, {opacity: 0}, {opacity: 1, onComplete: done}, 2.5)
      .set(image, {clearProps:"transform"})
    },
    beforeLeave(el) {
      let content = document.getElementsByClassName('post__content');
      TweenMax.to(content, .5, {autoAlpha: 0});

    },
    leave(el, done) {
      let tl = new TimelineMax;
      tl
      .to(el, 1, {autoAlpha: 0, onComplete: done},0)
    },
    checkForPosts() {
      const thisPost = this.getPost(this.$route.params.postSlug);
      if (thisPost) {
        this.fillPost(thisPost);
        this.mostRecent = this.getRecent;                
      } else {
        this.$store.dispatch('FETCH_SINGLE', {slug: this.$route.params.postSlug});
      }
      console.log(this.getRelated(this.current.category, this.currentPost.id).length);
    }
  },
  computed: {
    ...mapGetters({
      getPost: 'getPostBySlug',
      getRecent: 'getMostRecent',
      getRelated: 'getRelated',
      isFetching: 'isFetching',
    })
  },
  watch: {
    isFetching(newVal, oldVal) {
      if (newVal === false && newVal !== oldVal) {
        this.checkForPosts();
      }
    }
  },
  created() {
    // If not a new instance, check for posts
    if (!this.isFetching) {
      this.checkForPosts();
    }
  },
  beforeRouteUpdate(to, from, next) {
    if(to != from) {
      this.getThisPost(to);
    }
    next();
  }
}
</script>
