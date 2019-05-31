<template>
  <div id="app">
    <app-header @headHome="headHome()"></app-header>
      <router-view
        :key="$route.params.slug"
        :isLoaded="this.loaded">
      </router-view>
    <div class="cover cover__one"></div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'app',
  components: {
    AppHeader: Header,
    AppFooter: Footer
  },
  data() {
    return {
      loaded: false
    }
  },
  created() {
    this.$store.dispatch('FETCH_POSTS', {fresh: true}).then(() => {
      this.loaded = !this.loaded;
    });
  },
}
</script>
