import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/pages/User'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import NewArticle from '@/pages/NewArticle'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: User
    },{
      path: '/user',
      component: User
    },{
      path: '/article',
      component: Article
    },{
      path: '/category',
      component: Category
    },{
      path: '/newArticle',
      component: NewArticle
    }
  ]
})
