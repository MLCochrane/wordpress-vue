import Vue from 'vue'
import Router from 'vue-router'
import Posts from '@/components/Posts'
import Post from '@/components/Post'
import Category from '@/components/Category'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Posts',
      component: Posts,
      children: [
        {
          path: ':id',
          name: 'category',
          component: Category
        }
      ]
    },
    {
      path: '/posts/:postSlug',
      name: 'Post',
      component: Post
    },
    { path: '*', redirect: '/' }
  ]
})
