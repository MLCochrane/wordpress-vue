<template>
  <transition
    mode="out-in"
    :css="false"
    v-on:appear="appear"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <div class="posts-feed">
      <app-categories @getCategory="getCategory(...arguments)"></app-categories>
        <div class="posts-feed__post" v-for="(proj, index) in projects">
          <img class="posts-feed__image" :src="proj | getImage" alt="">
          <div class="posts-feed__details">
            <h1 @click="goTo(proj.slug)" @mouseover="active" @mouseleave="active" class="posts-feed__title">{{ proj.title.rendered }}</h1>
            <h2 class="posts-feed__count">{{ index | addOne }}</h2>
            <p class="posts-feed__date">{{ proj.date | stripDate }}</p>
            <p class="posts-feed__category">{{ proj.categories[0] | categoryTitle }}</p>
          </div>
      </div>


    <div class="pagination">
      <button class="pagination__view" @click="nextPage" type="button" v-if="!noMorePosts">View More</button>
      <h2 class="pagination__complete" v-else>No more posts</h2>
    </div>
  </div>
</transition>

</template>

<script>
import Categories from './Categories.vue'

export default {
  name: 'Posts',
  components: {
    appCategories: Categories
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
      let image = document.getElementsByClassName('active');
      let distanceY = -1 * (document.documentElement.clientHeight / 2);

      let tl = new TimelineMax;

      this.postWasClicked = true;

      tl
      .to([toRemove, filterToRemove], 1, {opacity: 0},0)
      .call(this.intoPost, [proj], 1);
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
      if (event.path) {
        var image = event.path[2].children[0];
        var meta = event.path[1].children[2];
        var category = event.path[1].children[3];
      } else {
        // Firefox does not have event.path
        var image = event.target.offsetParent.previousElementSibling;
        var meta = event.target.offsetParent.children[2];
        var category = event.target.offsetParent.children[3];
      }

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


      let el = document.getElementsByClassName('posts-feed');
      let tl = new TimelineMax;

      tl
      .to(el, .5, {autoAlpha: 0}, 0)
      .call(this.makeCall, [id])
      .to(el, 1.5, {autoAlpha: 1}, 1.5);


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
    },
    appear() {
      // let overlay = document.getElementsByClassName('home-overlay');
      // let tl = new TimelineMax;
      //
      // tl
      //   .to(overlay, 1, {autoAlpha: 0}, 4);
    },
    enter(el, done) {
      let one = document.getElementsByClassName('cover__one');
      let two = document.getElementsByClassName('cover__two');
      let btn = document.getElementsByClassName('pagination');

      let tl = new TimelineMax;
      tl
      .staggerTo([one,two], .4, {width: '130%'}, 0.25)
      .staggerTo([two,one], .4, {width: '0%'}, 0.25)
      .fromTo(btn, 1, {autoAlpha: 0}, {autoAlpha: 1}, .5)
      .fromTo(el, 1, {autoAlpha: 0}, {autoAlpha: 1, onComplete: done}, .5)
    },
    leave(el, done) {
      let image = el.getElementsByClassName('posts-feed__image');
      let one = document.getElementsByClassName('cover__one');
      let two = document.getElementsByClassName('cover__two');

      let tl = new TimelineMax;
      tl
        .to(image, 1, {scale: 0.75}, 0)
        .staggerTo([one,two], .4, {width: '130%'}, 0.25)
        .fromTo(el, 1.5, {autoAlpha: 1}, {autoAlpha: 0, onComplete: done}, 1.2)
        .staggerTo([two,one], .4, {width: '0%'}, 0.25);
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
  transform: skewX(10deg);
  top: 0;
  left: -15%;
  width: 0%;
  height: 100%;
  box-shadow: 0px 0px 50px -5px #eee;
  filter:blur(7px);
}
.cover__one {
  background-color: #fff;
}
.cover__two {
  /* background-color: #9aa8af; */
  background-color: #fff;
}

h1, h2 {
  font-weight: normal;
}
</style>
