import Vue from 'vue'
import Router from 'vue-router'
import Posts from '@/components/Posts'
import Post from '@/components/Post'
import Category from '@/components/Category'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
  ],
  scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
})
