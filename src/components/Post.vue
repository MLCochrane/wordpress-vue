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
  methods: {
    link() {
      var destinationSlug = this.$route.path.slice(this.category.length)

      this.$http.get('wp/v2/posts?slug=' + destinationSlug + '').then(response => {
        this.requestedPost.push(response.data[0]);
        this.content = this.requestedPost[0];
      }, error => {
        console.log(error);
      });
    }
  },
  created() {
    for (var i = 0; i<this.$parent.projects.length; i++) {
      if ((this.category + this.$parent.projects[i].slug) == this.$route.path) {
        this.content = this.$parent.projects[i];
        return false;
      }
    }
    if(this.requestedPost.length == 0) {
      this.link();
    }
  }
}
</script>

<style lang="css">
</style>
