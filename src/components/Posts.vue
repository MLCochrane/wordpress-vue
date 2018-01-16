<template>
  <div class="hello">
    <div v-for="proj in projects">
      <h1>{{ proj.title.rendered }}</h1>
      <!-- <div v-html="proj.content.rendered"></div> -->
      <img :src="proj | getImage" alt="">
      <button @click="goTo(proj.slug)">Click Me</button>
  </div>

  <div class="pagination">
    <button @click="nextPage" type="button" :disabled="noMorePosts">View More</button>
  </div>
</div>

</template>

<script>
export default {
  name: 'Posts',
  data () {
    return {
      projects: this.$parent.projects,
      noMorePosts: this.$parent.noMorePosts
    }
  },
  methods: {
    goTo(proj) {
      this.$router.push({ name: 'Post', params: { postSlug: proj }})
    },
    nextPage() {
      // checks that no more pages are available
      if (this.$parent.postData.page < this.$parent.headers.totalPages) {
        this.$parent.noMorePosts = false;
        this.$parent.postData.page++;
        this.$parent.getPosts();

        if (this.$parent.postData.page == this.$parent.headers.totalPages){
          this.noMorePosts = true;
        }
      } else {
        console.log('all done!');
      }
    }
  },
  filters: {
    getImage(string) {
      // the _embedded object is not present if no image has been set so check for that first
      if (string._embedded['wp:featuredmedia'] != undefined) {
        return string._embedded['wp:featuredmedia'][0].source_url;
      } else {
        // fallback image if no featured image is set
        return "http://localhost/wp-content/uploads/2018/01/Pro400H080.jpg"
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
img {
  width: 200px;
  height: 200px;
}
</style>
