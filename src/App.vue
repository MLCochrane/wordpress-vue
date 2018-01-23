<template>
  <div id="app">
    <!-- <img @click="goHome" src="./assets/logo.png"> -->
    <app-header @getPosts="getPosts(...arguments)"></app-header>
    <router-view :postInfo="postInfo" @getPosts="getPosts(...arguments)">
  </router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  name: 'app',
  components: {
    AppHeader: Header
  },
  data() {
    return {
      postInfo: {
        projects: [],
        postData: {
          page: 1,
          per_page: 5
        },
        headers: {
          totalPosts: '',
          totalPages: ''
        },
        noMorePosts: false
      }
    }
  },
  methods: {
    goHome() {
      this.postInfo.projects.splice(0, this.postInfo.projects.length);
      this.freshPosts()
      this.$router.push('/');
    },
    getPosts(more, page, destination) {
        // Updating params based on child component
        this.noMorePosts = more;
        this.postInfo.postData.page = page;

      this.$http.get('wp/v2/' + destination + '', {params: this.postInfo.postData}).then(response => {
        console.log(response.headers);
        // Stores total posts and # of pages for pagination
        this.postInfo.headers.totalPosts = response.headers['x-wp-total'];
        this.postInfo.headers.totalPages = response.headers['x-wp-totalpages'];

        if (destination.includes('posts?categories')) {
          // Clears out project array if selecting specific category
          this.postInfo.projects.splice(0, this.postInfo.projects.length);
          for (let project in response.data){
            this.postInfo.projects.push(response.data[project]);
          }
        } else {
          for (let project in response.data){
            this.postInfo.projects.push(response.data[project]);
          }
        }
      }, error => {
        console.log(error);
      });
    },
    freshPosts() {
      this.getPosts(false,1,'posts?_embed');
    }
  },
  created() {
    // false and 1 should be used to 'fresh' get request for posts
    this.freshPosts()
  }
}
</script>

<style>
body {
  /* background-color: #2E2826; */
  margin: 0;
}
#app {
  font-family: 'EB Garamond', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}
</style>
