<template>
  <transition
    name="fade"
    mode="out-in"
    :css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:before-leave="beforeLeave"
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
      <button @click="nextPage" type="button" :disabled="noMorePosts">View More</button>
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
    },
    beforeEnter: function (el) {
    },
    // the done callback is optional when
    // used in combination with CSS
    enter: function (el, done) {

      TweenMax.fromTo(el, 3, {autoAlpha: 0}, {autoAlpha: 1, onComplete: done}, 0);
    },
    beforeLeave(el) {
    },
    leave(el, done) {
      let image = el.getElementsByClassName('posts-feed__image');
      let one = document.getElementsByClassName('cover__one');
      let two = document.getElementsByClassName('cover__two');

      let tl = new TimelineMax;
      tl
        .to(image, 1, {scale: 0.75}, 0)
        .staggerTo([one,two], .4, {width: '130%'}, 0.25)
        .fromTo(el, 1, {autoAlpha: 1}, {autoAlpha: 0, onComplete: done}, 1)
        .staggerTo([two,one], .4, {width: '0%'}, 0.25)


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
}
.cover__one {
  background-color: #dee4e7;
}
.cover__two {
  /* background-color: #9aa8af; */
  background-color: #fff;
}

h1, h2 {
  font-weight: normal;
}
</style>
