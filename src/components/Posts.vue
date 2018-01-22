<template>
  <div class="posts-feed">
    <div class="posts-feed__post" v-for="(proj, index) in projects">
      <img class="posts-feed__image" :src="proj | getImage" alt="">

      <div class="posts-feed__details">
        <h1 @mouseover="active" @mouseleave="active" class="posts-feed__title">{{ proj.title.rendered }}</h1>
        <h2 class="posts-feed__count">{{ index | addOne }}</h2>
        <!-- <h2 class="posts-feed__link" @click="goTo(proj.slug)">View Post</h2> -->
      </div>
  </div>

  <div class="pagination">
    <button @click="nextPage" type="button" :disabled="noMorePosts">View More</button>
  </div>

  <div @click="movePage" class="next-block"></div>
</div>
</template>

<script>
export default {
  name: 'Posts',
  data () {
    return {
      projects: this.$parent.projects,
      noMorePosts: this.$parent.noMorePosts
      // activeImage: false
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
    },
    movePage() {
      var posts = document.getElementsByClassName('posts-feed')[0];
      posts.scrollTo(1800, 0);
    },
    active(event) {
      // this.activeImage = !this.activeImage;

      // Haven't found a better way of selecting the currently hovered image
      let image = event.path[2].children[0];
      image.classList.toggle('active');
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
<style>
.posts-feed {
  margin-top: 5rem; 
}
.posts-feed__post{
  position: relative;
  overflow: hidden;
}
.posts-feed__details {
  position: relative;
  max-width: 1000px;
  float: right;
  clear: both;
  margin-right: 20rem;
}
.posts-feed__title {
  font-size: 70px;
}
.posts-feed__title:hover {
  cursor: pointer;
  color: #FC4C4C;
}
.posts-feed__count {
  position: absolute;
  right: 0%; /* The details div resizes to length of title, so this will cause numbers to be offset with each other */
  top: 10%;
}
.posts-feed__image {
  position: fixed;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%;
  width: auto;
  height: 700px;
  visibility: hidden;
  z-index: -9;
}
.active {
  visibility: visible;
}
.pagination {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
h1, h2 {
  font-weight: normal;
}
</style>
