import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Sample from '@/components/home/Sample'
import Readme from '@/components/home/Readme'

import ZhihuSample from '@/components/zhihu/ZhihuSample'
import ZhihuAnswer from '@/components/zhihu/ZhihuAnswer'

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
          name: 'readme',
          path: '/readme',
          component: Readme
        },
        {
          name: 'zhihu-sample',
          path: '/zhihu-sample',
          component: ZhihuSample
        },
        {
          name: 'zhihu-answer',
          path: '/zhihu-answer',
          component: ZhihuAnswer
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
