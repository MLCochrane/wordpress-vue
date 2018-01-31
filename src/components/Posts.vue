<template>
  <div class="posts-feed">
    <app-filter @getCategory="getCategory(...arguments)"></app-filter>
    <div class="posts-feed__post" v-for="(proj, index) in projects">
      <img class="posts-feed__image" :src="proj | getImage" alt="">
      <div class="posts-feed__details">
        <h1 @click="goTo(proj.slug)" @mouseover="active" @mouseleave="active" :disabled="postWasClicked" class="posts-feed__title">{{ proj.title.rendered }}</h1>
        <h2 class="posts-feed__count">{{ index | addOne }}</h2>
        <p class="posts-feed__date">{{ proj.date | stripDate }}</p>
        <p class="posts-feed__category">{{ proj.categories[0] | categoryTitle }}</p>
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
      categoryID: this.postInfo.categoryID,
      postWasClicked: false
    }
  },
  methods: {
    goTo(proj) {
      let toRemove = document.querySelectorAll('.posts-feed > .posts-feed__post > .posts-feed__details');
      let filterToRemove = document.getElementsByClassName('categories')[0];
      let tl = new TimelineMax;

      this.postWasClicked = true;

      tl
      .to([toRemove, filterToRemove], .5, {opacity: 0},0)
      .call(this.intoPost, [proj], 0);
    },
    intoPost(proj) {
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

      // This check removes the flashing of the featured image if the user moves mouse off title while transition happens
      if (this.postWasClicked == false) {
        image.classList.toggle('active');
        meta.classList.toggle('posts-feed__date--active');
        category.classList.toggle('posts-feed__category--active');
      }
    },
    getCategory(id) {
      this.categoryID = id; // Sets categoryID in case user wants to load more posts of specific category in nextPage()
      this.postData.page = 1;
      this.noMorePosts = false;

      let one = document.getElementsByClassName('cover__one');
      let two = document.getElementsByClassName('cover__two');
      // let three = document.getElementsByClassName('cover__three');
      let tl = new TimelineMax;

      tl
      .staggerTo([one,two], .75, {height: '130%', ease: Power3.easeOut}, .3)
      .call(this.makeCall, [id])
      .staggerTo([two,one], .75, {height: '0%', ease: Power3.easeOut}, .3)




      // This isn't really necessary
      // this.$router.push({ name: 'category', params: { id: id }})
    },
    makeCall(id) {
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
.cover {
  position: fixed;
  transform: skewY(7deg);
  bottom: -15%;
  width: 100%;
  height: 0;
  z-index: 100;
  /* box-shadow: 0px -5px 30px 20px #fff; */
}
.cover__one {
  background-color: #dee4e7;
}
.cover__two {
  background-color: #dee4e7;
}

h1, h2 {
  font-weight: normal;
}
</style>
