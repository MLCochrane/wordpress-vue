<template lang="html">
  <transition
    appear
    name="fade"
    mode="out-in"
    :css="false"
    v-on:appear="customAppearHook"
    v-on:enter="enter"
    v-on:before-leave="beforeLeave"
    v-on:leave="leave"
  >
    <div class="post">
      <div class="post__intro">
        <div class="post__container post__container--left">
          <img class="post__featured" :src="requestedPost[0] | getImage" alt="">
        </div>
        <div class="post__container post__container--right">
          <div class="post__title">
            <h1>{{ current.title.rendered }}</h1>
          </div>
          <div class="post__meta">
            <h4 class="post__heading">Published:</h4>
            <h4>{{ current.date | stripDate }}</h4>
            <h4 class="post__heading">Category:</h4>
            <h4>{{ current.category | categoryTitle }}</h4>
          </div>
        </div>
      </div>
      <div class="post__content">
        <div v-html="current.content.rendered"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      requestedPost: [],
      current: {
        title: '',
        date: '',
        category: '',
        content: ''
      },
      type: '/posts/' //not sure if this helps with D.R.Y at all
    }
  },
  props: ['postInfo'],
  methods: {
    getThisPost() {
      var destinationSlug = this.$route.path.slice(this.type.length)

      this.$http.get('wp/v2/posts?slug=' + destinationSlug + '&_embed').then(response => {
        this.requestedPost.push(response.data[0]);
        this.fillPost();
      }, error => {
        // need better error handling here
        // an error here means no post with this slug on site
        console.log(error);
      });
    },
    fillPost() {
      this.current.title = this.requestedPost[0].title;
      this.current.content = this.requestedPost[0].content;
      this.current.date = this.requestedPost[0].date;
      this.current.category = this.requestedPost[0].categories[0];
    },
    customAppearHook(el) {
        let title = el.getElementsByClassName('post__title');
        let content = el.getElementsByClassName('post__content');
        let meta = el.getElementsByClassName('post__meta');
        let containers = el.getElementsByClassName('post__container');

        let tl = new TimelineMax;
        tl
        .set(containers, {width:'49%'})
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
      let containers = el.getElementsByClassName('post__container');
      let tl = new TimelineMax;


      tl
      .from(image, .75, {opacity: 0, scale: 0.8}, 1.5)
      .fromTo(containers, 2, {width: '0%'}, {width:'49%'}, 2)
      .fromTo(title, 1, {opacity: 0}, {opacity: 1}, 4)
      .fromTo([content, meta], 1, {opacity: 0}, {opacity: 1, onComplete: done}, 4.5)
      .set(image, {clearProps:"transform"});
    },
    beforeLeave(el) {
    },
    leave(el, done) {
      done()
    }
  },
  created() {
    // Checks projects array for this post based off the slug and takes content from there if found
    for (var i = 0; i<this.postInfo.projects.length; i++) {
      if ((this.type + this.postInfo.projects[i].slug) == this.$route.path) {
        this.requestedPost[0] = this.postInfo.projects[i];
        this.fillPost();
        return false;
      }
    }
    // If post isn't found make a request for this one post
    if(this.requestedPost.length == 0) {
      this.getThisPost();
    }
  }
}
</script>

<style lang="css">
</style>
