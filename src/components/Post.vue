<template lang="html">
  <div class="post">
    <h1>{{ content.title.rendered }}</h1>
    <div v-html="content.content.rendered"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestedPost: [],
      content: {
        content: '',
        title: ''
      },
      category: '/posts/' //not sure if this helps with D.R.Y at all
    }
  },
  props: ['postInfo'],
  methods: {
    getThisPost() {
      var destinationSlug = this.$route.path.slice(this.category.length)

      this.$http.get('wp/v2/posts?slug=' + destinationSlug + '').then(response => {
        this.requestedPost.push(response.data[0]);
        this.content = this.requestedPost[0];
      }, error => {
        // need better error handling here
        // an error here means no post with this slug on site
        console.log(error);
      });
    }
  },
  created() {
    console.log(this.postInfo);
    // Checks projects array for this post based off the slug and takes content from there if found
    for (var i = 0; i<this.postInfo.projects.length; i++) {
      if ((this.category + this.postInfo.projects[i].slug) == this.$route.path) {
        this.content = this.postInfo.projects[i];
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
