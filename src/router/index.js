import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Sample from '@/components/home/Sample'
import ZhihuSample from '@/components/zhihu/ZhihuSample'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/',
          redirect: '/sample'
        },
        {
          name: 'sample',
          path: '/sample',
          component: Sample
        },
        {
          name: 'zhihu-sample',
          path: '/zhihu-sample',
          component: ZhihuSample
        },
        {
          path: '/home/*',
          redirect: '/sample'
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
