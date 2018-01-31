<template lang="html">
  <div class="post">
    <div class="post__intro">
        <img class="post__featured" :src="requestedPost[0] | getImage" alt="">
        <div class="post__title">
          <h1>{{ current.title.rendered }}</h1>
          <div v-html="current.content.rendered"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestedPost: [],
      current: {
        title: '',
        content: ''
      },
      category: '/posts/' //not sure if this helps with D.R.Y at all
    }
  },
  props: ['postInfo'],
  methods: {
    getThisPost() {
      var destinationSlug = this.$route.path.slice(this.category.length)

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
    },
    moveImage() {
      let image = document.getElementsByClassName('post__featured')[0];

      let tl = new TimelineMax;
      let distanceX = -0.9 * (document.documentElement.clientWidth / 2);
      let distanceY = -0.9 * (document.documentElement.clientHeight / 2);

      console.log(distanceY);

      tl
        .to(image, 2, {x: distanceX, y: distanceY, scale: '1.4', ease: Power3.easeOut}, 0);
    }
  },
  filters: {
    getImage(string) {
      if (string) {
      //   // the _embedded object is not present if no image has been set so check for that first
        if (string._embedded['wp:featuredmedia'] != undefined) {
          return string._embedded['wp:featuredmedia'][0].source_url;
        }
      }
    }
  },
  mounted() {
    this.moveImage();
  },
  created() {
    // Checks projects array for this post based off the slug and takes content from there if found
    for (var i = 0; i<this.postInfo.projects.length; i++) {
      if ((this.category + this.postInfo.projects[i].slug) == this.$route.path) {
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
