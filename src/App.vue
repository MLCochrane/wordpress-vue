<template>
  <div id="app">
    <img @click="goHome" src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      testing: 'hello',
      projects: [],
      postData: {
        page: 1,
        per_page: 5
      }
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    getPosts() {
      this.$http.get('wp/v2/posts?_embed', {params: this.postData}).then(response => {
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
