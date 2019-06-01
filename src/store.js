import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import router from './router';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fetching: false,
    posts: [],
    postIds: [],
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
    FETCH_REQUEST: (state, payload) => {
      state.fetching = true;
    },
    FETCH_POSTS: (state, payload) => {
      const res = payload.response;
      state.headers.totalPosts = res.headers['x-wp-total'];
      state.headers.totalPages = res.headers['x-wp-totalpages'];

      // Boolean to determine if pushing or overwriting posts array
      const fresh = payload.fresh;
      if (fresh && fresh.fresh) {
        state.posts = res.data;
        res.data.forEach(post => {
          state.postIds.push(post.id);
        });
        state.noMorePosts = false;
      } else {
        res.data.forEach(post => {
          if (!state.postIds.includes(post.id)) {
            state.posts.push(post)
            state.postIds.push(post.id);
          }
          state.posts.sort((a, b) => (b.id - a.id));
        });
      }
      state.fetching = false;
      if (state.noMorePosts != true && state.postData.page < state.headers.totalPages) {
        state.postData.page++;
      } else {
        state.noMorePosts = true;
      }
    },
    ADD_SINGLE: (state, payload) => {
      const post = payload[0];
      state.posts.push(post);
      state.postIds.push(post.id);
      state.fetching = false;
    },
    CHANGE_CATEGORY: (state, payload) => {
      state.noMorePosts = false;
      state.categoryID = payload.id;
    }
  },
  actions: {
    FETCH_POSTS: ({commit, state}, payload) => {
      return new Promise((resolve, reject) => {

        commit('FETCH_REQUEST');

        if (payload.fresh === true || payload.switching) {
          state.postData.page = 1;
        }
        let url;
        // Change endpoint if within specific category
        if (payload && payload.id && payload.id !== '') {
          url = `${process.env.ROOT_API}/wp/v2/posts?categories=${payload.id}&_embed`;
        } else {
          url = `${process.env.ROOT_API}/wp/v2/posts?_embed`;
        } 
        axios({
          method: 'GET',
          url: url,
          params: state.postData
        }).then(response => {
          commit('FETCH_POSTS',
          {
            response: response,
            fresh: payload.fresh
          });
          resolve();
        }).catch(err => {
          console.error(err);
        })
      });
    },
    CHANGE_CATEGORY: ({dispatch, commit}, id) => {
      commit('CHANGE_CATEGORY', id);
      dispatch('FETCH_POSTS', {fresh: false, id: id.id, switching: true });
    },
    FETCH_SINGLE: ({commit, state}, slug) => {
      commit('FETCH_REQUEST');

      axios({
        method: 'GET',
        url: `${process.env.ROOT_API}/wp/v2/posts?slug=${slug.slug}&_embed`
      }).then(response => {
        commit('ADD_SINGLE', response.data);
      }).catch(err => {
        console.error(err);
        router.push({path: '/', query: {
          fresh: true
        }});
      })
    }
  },
  getters: {
    postCount: state => state.posts.length,
    getMostRecent: state => state.posts[0],
    getPostBySlug: state => slug => {
      return state.posts.find(post => post.slug === slug);
    },
    getPosts: state => {
      if (state.categoryID !== '') {
        return state.posts.filter(el => el.categories[0] === state.categoryID);
      } else {
        return state.posts;
      }
    },
    getRelated: state => (categoryID, postId) => {
      return state.posts.filter(el => el.categories[0] === categoryID && el.id !== postId);
    },
    isFetching: state => state.fetching,
    getCategory: state => state.categoryID,
    noMorePosts: state => state.noMorePosts,
  }
});
