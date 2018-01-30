<template>
  <div class="posts-feed">
    <app-filter @getCategory="getCategory(...arguments)"></app-filter>
    <div class="posts-feed__post" v-for="(proj, index) in projects">
      <img class="posts-feed__image" :src="proj | getImage" alt="">
      <div class="posts-feed__details">
        <h1 @click="goTo(proj.slug)" @mouseover="active" @mouseleave="active" class="posts-feed__title">{{ proj.title.rendered }}</h1>
        <h2 class="posts-feed__count">{{ index | addOne }}</h2>
        <p class="posts-feed__date">{{ proj.date | stripDate }}</p>
        <p class="posts-feed__category">{{ proj.categories[0] | categoryTitle }}</p>
        <!-- <h2 class="posts-feed__link" @click="goTo(proj.slug)">View Post</h2> -->
      </div>
  </div>

  <div class="pagination">
    <button @click="nextPage" type="button" :disabled="noMorePosts">View More</button>
  </div>
</div>
</template>

<script>
import Filter from './Filter.vue'

export default {
  name: 'Posts',
  components: {
    appFilter: Filter
  },
  props: ['postInfo'],
  data () {
    return {
      projects: this.postInfo.projects,
      postData: {
        page: this.postInfo.postData.page,
        per_page: this.postInfo.postData.per_page
      },
      headers: this.postInfo.headers,
      noMorePosts: this.postInfo.noMorePosts,
      categoryID: this.postInfo.categoryID
    }
  },
  methods: {
    goTo(proj) {
      this.$router.push({ name: 'Post', params: { postSlug: proj }});
    },
    nextPage() {
      // checks that no more pages are available
      if (this.noMorePosts != true && this.postData.page < this.headers.totalPages) {
        // this.noMorePosts = false;
        this.postData.page++;

        if(this.categoryID == '') {
          // emit event to parent to get more posts
          this.$emit('getPosts', this.categoryID, this.noMorePosts, this.postData.page, 'posts?_embed');
        } else {
          this.$emit('getPosts', this.categoryID, this.noMorePosts, this.postData.page, 'posts?categories=' + this.categoryID + '&_embed');
        }
        // confirms on last page
        if (this.postData.page == this.headers.totalPages){
          this.noMorePosts = true;
        }
      } else {
        this.noMorePosts = true;
        // Add something visible to user
        console.log('all done!');
      }
    },
    active(event) {
      // Haven't found a better way of selecting the currently hovered project
      let image = event.path[2].children[0];
      let meta = event.path[1].children[2];
      let category = event.path[1].children[3];

      image.classList.toggle('active');
      meta.classList.toggle('posts-feed__date--active');
      category.classList.toggle('posts-feed__category--active');
    },
    getCategory(id) {
      this.categoryID = id; // Sets categoryID in case user wants to load more posts of specific category in nextPage()
      this.postData.page = 1;
      this.noMorePosts = false;

      // This isn't really necessary
      this.$router.push({ name: 'category', params: { id: id }});

      // if user wants to go back to viewing 'all' posts
      if (id == '') {
        // Need to also clear out projects array
        this.$emit('freshPosts');
      } else {
        this.$emit('getPosts', id, false, 1, 'posts?categories=' + id + '&_embed');
      }
    }
  },
  watch: {
    'postInfo': {
	    handler: function(newInfo) {
        this.projects = newInfo.projects,
        this.postData.page = newInfo.postData.page,
        this.postData.per_page = newInfo.postData.per_page,
        this.headers = newInfo.headers,
        this.noMorePosts = newInfo.noMorePosts,
        this.categoryID = newInfo.categoryID
      }, deep: true //this seems to be the ticket
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
    stripDate(string) {
      if (string) {
        var date = new Date(string);
        var options = {year: "numeric", month: "long", day: "numeric"};
        date = date.toLocaleTimeString("en-us", options);
        date = date.split(' ');
        return (date[0] + ' ' + date[1] + ' ' + date[2].slice(0,4));
      }
    },
    categoryTitle(id) {
      switch (id) {
        case 1:
          return 'Uncategorized';
          break;
        case 2:
          return 'Photography';
          break;
        default: return "No category";

      }
    },
    addOne(string) {
      // Simply to have post numbers start at 1 and not 0
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
  /* float: right; */
  clear: both;
  margin-right: 20rem;
  margin: auto;
}
.posts-feed__title {
  font-size: 70px;
}
.posts-feed__title:hover {
  font-size: 70px;
  cursor: pointer;
  color: #FC4C4C;
}
.posts-feed__count {
  position: absolute;
  right: 0%; /* The details div resizes to length of title, so this will cause numbers to be offset with each other */
  top: 10%;
}
.posts-feed__date {
  opacity: 0;
  transition: all 500ms;
}
.posts-feed__date--active {
  opacity: 1;
}
.posts-feed__category {
  opacity: 0;
  transition: all 500ms;
}
.posts-feed__category--active {
  opacity: 1;
}
.posts-feed__image {
  position: fixed;
  -webkit-transform: translateY(-50%) translateX(-50%);
          transform: translateY(-50%) translateX(-50%);
  top: 50%;
  left: 50%;
  width: auto;
  height: 700px;
  /* visibility: hidden; */
  opacity: 0;
  z-index: -9;
  -webkit-transition: opacity 500ms;
  transition: opacity 500ms;
  -webkit-backface-visibility: hidden;
}
.active {
  /* visibility: visible; */
  -webkit-transform: translateY(-50%) translateX(-50%);
          transform: translateY(-50%) translateX(-50%);
  opacity: 1;
}
.pagination {
  position: relative;
  left: 50%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
  margin: 10rem 0 5rem 0;
}
.pagination button {
  border: none;
  padding: 1em 2em;
}
.pagination button:hover {
cursor: pointer;
}
.pagination button:active {
  cursor: pointer;
  background-color: #FC4C4C;
}
.categories {
  position: absolute;
  overflow: hidden;
  left: 50%;
  -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
  text-align: center;
  z-index: 999;
}
.categories__list {
  margin-top: 2.5rem;
  text-align: center;
}
.categories__item {
  display: inline-block;
  list-style: none;
  margin-right: 2rem;
}
.categories__item:hover {
  cursor: pointer;
  text-decoration: underline;
}
h1, h2 {
  font-weight: normal;
}
</style>
