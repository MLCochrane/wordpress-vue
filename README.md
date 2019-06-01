# Blog w/ VueJS and WordPress REST API

This is the new site for my personal blog, Useless By Design 'http://uselessbydesign.ca'. I had previously made my site with a custom WP theme but wanted an update. I'm much more comfortable in JS than I am in PHP and had wanted to add page routing along with route transitions to my site. Without wanting to implement a custom CMS or manually update my site via FTP each time I wanted to post, the WP API was the obvious direction to go since all my previous post information was there. My dist files are placed in the root of my domain and all my WP files are in a subdirectory. My current WP theme has two blank files for index and styles with functions.php simply adding support for featured images and removing paragraph tags when adding an image into a post.

I've only added support for requesting posts from WP because I don't make use of any pages in this site, although it would be simple enough to include if this was going to used for another domain. It should be noted that the request time to the WP API may vary and can be affected by any plugins you may have, your web host, etc. The timeline durations should be altered based on the average time it takes for the request to go through to avoid undesired transitions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Install

Once you've cloned or downloaded the repo you can:

```
npm install
```

Which will install all the necessary dependancies.

Running a development environment is done with:

```
npm run dev
```
### Setting Up Environments
Within the config folder consists of two files we need to modify: prod.env.js and dev.env.js.

``` javascript
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://localhost:80/wp-json"'
})
```
This is where you can set any environment variables you need, but right now we're just concerned with the location of our API. The ROOT_API in the development environment currently points to the default port when running with MAMP, but this can be wherever you're serving WP from.

## Site Specific

Each switch case corresponds to the category ID found within WP and must also be changed within the Header.vue, Categories.vue files.

```javascript
// Need to modify based on category IDs within wordpress
Vue.filter('categoryTitle', function(id) {
      switch (id) {
        case 6:
          return 'Photography';
          break;
        case 7:
          return 'Troubled Mind';
          break;
        case 8:
          return 'Something Made';
          break;
        case 9:
          return 'Read, Watch, Listen';
          break;
        default: return "No category";
      }
    });
```

It should be noted that although this will connect to the API, these requests are technically going though the index.php file. This is important to know because if you're setting the index.html file to be picked over your index.php in the htaccess file:
```
DirectoryIndex index.html index.php

/// other logic

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```
...and are handling routes yourself like I am:

```javascript
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Posts',
      component: Posts
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
```
...then /wp-json is not a route that exists. Long story short the route should explicitly go through the index.php file in your domain directory.

## Built With

* [SCSS](http://sass-lang.com/)
* [VueJS](https://vuejs.org/)
* [GSAP](https://greensock.com/gsap)
* [axios](https://www.npmjs.com/package/axios)


## Authors

* **Luke Cochrane** - [MLCochrane](https://github.com/MLCochrane)
