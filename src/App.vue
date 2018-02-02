<template>
  <div id="app">
    <app-header @headHome="headHome()"></app-header>
      <router-view :postInfo="postInfo" @getPosts="getPosts(...arguments)" @freshPosts="freshPosts()"></router-view>
    <div class="cover cover__one"></div>
    <div class="cover cover__two"></div>
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
        noMorePosts: false,
        categoryID: ''
      }
    }
  },
  methods: {
    getPosts(id, more, page, destination) {
        // Updating params based on child component
        this.postInfo.categoryID = id;
        this.noMorePosts = more;
        this.postInfo.postData.page = page;

      this.$http.get('wp/v2/' + destination + '', {params: this.postInfo.postData}).then(response => {
        // Stores total posts and # of pages for pagination
        this.postInfo.headers.totalPosts = response.headers['x-wp-total'];
        this.postInfo.headers.totalPages = response.headers['x-wp-totalpages'];

        // Checking if the first page was requested allows for pagination within a category without clearing array
        if (destination.includes('posts?categories') && page == 1) {
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
      this.postInfo.categoryID = '';
      this.postInfo.postData.page = 1;
      // resets array if someone navvigates to 'all' category
      if (this.postInfo.projects != 0) {
        this.postInfo.projects.splice(0, this.postInfo.projects.length);
      }
      this.getPosts('',false,1,'posts?_embed');
    },
    headHome() {
      this.$router.push('/');
      this.freshPosts()
    }
  },
  created() {
    this.freshPosts()
  }
}
</script>
