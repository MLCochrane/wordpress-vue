<template>
    <div class="pagination">
      <button class="pagination__view" @click="nextPage" type="button" v-if="!noMorePosts && !this.isFetching">View More</button>
      <h3 class="pagination__complete" v-else-if="this.isFetching">Loading...</h3>
      <h3 class="pagination__complete" v-else>No more posts</h3>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Pagination',
  methods: {
    nextPage() {
      if (!this.noMorePosts) {
        this.$store.dispatch('FETCH_POSTS');
      }
    },
  },
  computed: {
    ...mapGetters([
      'isFetching',
      'noMorePosts'
    ])
  },
}
</script>

