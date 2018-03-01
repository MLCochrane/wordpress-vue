<template lang="html">
  <div class="header">
    <div @click="headHome" class="logo"></div>
    <div @click="dropdownClicked" class="burger">
      <svg id="burger-svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
        <rect class="burger__element burger__element--top" y="10" width="50" height="10" rx="2" ry="2" style="fill: #231f20"/>
        <rect class="burger__element burger__element--bottom" y="30" width="50" height="10" rx="2" ry="2" style="fill: #231f20"/>
      </svg>
    </div>
      <div class="dropdown">
        <h1 class="dropdown__title centered-content">USELESS</h1>
        <ul class="dropdown__list centered-content">
          <li><h1 @click="emitMethod('')" class="dropdown__item">Home</h1></li>
          <li><h1 @click="emitMethod(6)" class="dropdown__item">Photography</h1></li>
          <li><h1 @click="emitMethod(7)" class="dropdown__item">Troubled Mind</h1></li>
          <li><h1 @click="emitMethod(9)" class="dropdown__item">Read Watch Listen</h1></li>
          <li><h1 @click="emitMethod(8)" class="dropdown__item">Something Made</h1></li>
        </ul>
      <h2 class="dropdown__contact">Need to get in touch? Send us an email at <a href="mailto:info@uselessbydesign.ca">info@uselessbydesign.ca</a>.</h2>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false
    }
  },
  methods: {
    dropdownClicked() {
      this.dropdownOpen = !this.dropdownOpen;

      let categories = document.getElementsByClassName('categories')[0];
      let burgOne = document.getElementsByClassName('burger__element--top')[0];
      let burgTwo = document.getElementsByClassName('burger__element--bottom')[0];
      let title = document.getElementsByClassName('dropdown__title')[0];
      let background = document.getElementsByClassName('dropdown')[0];



      if (this.dropdownOpen == true) {
        if (categories) {
          if (window.matchMedia("(min-width: 768px)").matches) {
            TweenMax.to(categories, .5, {autoAlpha: 0});
          }
        }
        let tl = new TimelineMax;

        tl
        .to(background, .5, {autoAlpha: 1}, 0)
        .fromTo(title, .5, {left:'45%'}, {left: '50%'}, 0)
        .to(burgOne, .5, {y: '10', ease:Power3.easeInOut}, 0)
        .to(burgTwo, .5, {y: '-10', ease:Power3.easeInOut}, 0)
        .to(burgOne, .5, {rotation:45, svgOrigin:"25 25", ease:Power3.easeInOut}, .5)
        .to(burgTwo, .5, {rotation:'-45', svgOrigin:"25 25", ease:Power3.easeInOut}, .5);
      } else {
        if (categories) {
          if (window.matchMedia("(min-width: 768px)").matches) {
            TweenMax.to(categories, .5, {autoAlpha: 1, clearProps: 'all'});
          }
        }
        let tl = new TimelineMax;

        tl
        .to(background, .75, {autoAlpha: 0}, .45)
        .fromTo(title, .5, {left:'50%'}, {left: '45%'}, 0)
        .to(burgOne, .5, {rotation:0, svgOrigin:"25 25", ease:Power3.easeInOut}, 0)
        .to(burgTwo, .5, {rotation:0, svgOrigin:"25 25", ease:Power3.easeInOut}, 0)
        .to(burgOne, .5, {y: 0, ease:Power3.easeInOut}, .5)
        .to(burgTwo, .5, {y: 0, ease:Power3.easeInOut}, .5);

      }
    },
    headHome() {
      this.$emit('headHome');
    },
    getCategory(id) {
      this.$emit('getPosts', id, false, 1, 'posts?categories=' + id + '&_embed');
    },
    emitMethod (id) {
      // EventBus sent to Posts.vue
      this.dropdownClicked();
      let payLoad = id;
      if(this.$route.path.includes('/posts')) {
        this.$router.push('/');

        //remember that arrow functions do not have its own 'this'
        setTimeout(() => {
          this.$eventHub.$emit('eventName', payLoad);
        }, 100);
      } else {
        this.$eventHub.$emit('eventName', payLoad);
      }
    }
  }
}
</script>
