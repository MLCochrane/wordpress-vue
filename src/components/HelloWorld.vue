<template>
  <div class="hello">
    <div v-for="proj in projects">
      <h1>{{ proj.title.rendered }}</h1>
      <div v-html="proj.content.rendered"></div>
  </div>
</div>

</template>

<script>
import striptags from 'striptags';

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      projects: [],
    }
  },
  filters: {
    strip(string) {
      // if(!string) return ''
      // return striptags(string)
      // return string;
    }
  },
  created() {
    this.$http.get('wp/v2/posts').then(response => {
      for (let project in response.data){
        this.projects.push(response.data[project]);
      }
    }, error => {
      console.log(error);
    });
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
</style>
