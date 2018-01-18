<template>
  <div class="posts-feed">
    <div class="posts-feed__post" v-for="(proj, index) in projects">
      <img :src="proj | getImage" alt="">
      <h2 class="posts-feed__count">{{ index | addOne }}</h2>
      <div class="posts-feed__details">
        <h1 class="posts-feed__title">{{ proj.title.rendered }}</h1>
        <h2 class="posts-feed__link" @click="goTo(proj.slug)">Learn More</h2>
      </div>
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
    },
    addOne(string) {
      return string + 1;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.posts-feed{
  white-space: nowrap;
  /* overflow: hidden; */
  overflow-y: hidden;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.posts-feed__post {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 85%;
  height: 100vh;
}
.posts-feed__details {
  position: absolute;
  top: 30%;
  right: 0;
  margin: 0;
  max-width: 800px;
  text-align: right;
}
.posts-feed__title {
  white-space: normal;
  font-size: 120px;
  text-justify: right;
  color: #F2342D;
}
.posts-feed__link {
  font-family: sans-serif;
  text-transform: uppercase;
  color: #808080;
  font-size: 18px;
}
.posts-feed__link:hover {
  cursor: pointer;
}
.posts-feed__count {
  position: absolute;
  top: -10%;
  right: 0;
  color: #fff;
  opacity: 0.1;
  font-size: 800px;
  margin: 0;
}
.pagination {
  padding: 100px;
  display: inline-block;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
}
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
  position: absolute;
  top: 100px;
  left: 175px;
  width: 1020px;
  height: 800px;
}
</style>
