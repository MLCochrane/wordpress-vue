<template>
  <div id="app">
    <!-- <img @click="goHome" src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      projects: [],
      postData: {
        page: 1,
        per_page: 2
      },
      headers: {
        totalPosts: '',
        totalPages: ''
      },
      noMorePosts: false
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    getPosts() {
      this.$http.get('wp/v2/posts?_embed', {params: this.postData}).then(response => {
        this.headers.totalPosts = response.headers.map['x-wp-total'][0];
        this.headers.totalPages = response.headers.map['x-wp-totalpages'][0];

        for (let project in response.data){
          this.projects.push(response.data[project]);
        }
      }, error => {
        console.log(error);
      });
    }
  },
  created() {
    this.getPosts();
  }
}
</script>

<style>
body {
  background-color: #2E2826;
  margin: 0;
}
#app {
  font-family: 'EB Garamond', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
