import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fetching: false,
    posts: [],
    postData: {
      page: 1,
      per_page: 5,
    },
    headers: {
      totalPosts: '',
      totalPages: ''
    },
    categoryID: '',
    noMorePosts: false
  },
  mutations: {
    FETCH_POSTS: (state, payload) => {
      const res = payload.response;
      state.headers.totalPosts = res.headers['x-wp-total'];
      state.headers.totalPages = res.headers['x-wp-totalpages'];

      // Boolean to determine if pushing or overwriting posts array
      const fresh = payload.fresh;
      if (fresh && fresh.fresh) {
        state.posts = res.data;
        state.noMorePosts = false;
      } else {
        res.data.forEach(post => state.posts.push(post));
      }
      state.fetching = false;
      if (state.noMorePosts != true && state.postData.page < state.headers.totalPages) {
        state.postData.page++;
      } else {
        state.noMorePosts = true;
      }
    },
    ADD_SINGLE: (state, payload) => {
      state.posts.push(payload[0]);
      state.fetching = false;
    },
    CHANGE_CATEGORY: (state, payload) => {
      state.categoryID = payload.id;
    }
  },
  actions: {
    FETCH_POSTS: ({commit, state}, fresh) => {
      return new Promise((resolve, reject) => {
        state.fetching = true;
        if (fresh && fresh.fresh) {
          state.postData.page = 1;
        }
        let url;
        // Change endpoint if within specific category
        if (!state.categoryID) {
          url = `${process.env.ROOT_API}/wp/v2/posts?_embed`;
        } else {
          url = `${process.env.ROOT_API}/wp/v2/posts?categories=${state.categoryID}&_embed`;
        } 
        axios({
          method: 'GET',
          url: url,
          params: state.postData
        }).then(response => {
          commit('FETCH_POSTS',
          {
            response: response,
            fresh: fresh
          });
          resolve();
        }).catch(err => {
          console.error(err);
        })
      });
    },
    CHANGE_CATEGORY: ({dispatch, commit}, id) => {
      commit('CHANGE_CATEGORY', id);
      dispatch('FETCH_POSTS', {fresh: true});
    },
    FETCH_SINGLE: ({commit, state}, slug) => {
      state.fetching = true;
      axios({
        method: 'GET',
        url: `${process.env.ROOT_API}/wp/v2/posts?slug=${slug.slug}&_embed`
      }).then(response => {
        commit('ADD_SINGLE', response.data);
      }).catch(err => {
        console.error(err);
      })
    }
  },
  getters: {
    postCount: state => state.posts.length,
    getPostBySlug: state => slug => {
      return state.posts.find(post => post.slug === slug);
    },
    getPosts: state => state.posts,
    isFetching: state => state.fetching,
    noMorePosts: state => state.noMorePosts,
  }
});
