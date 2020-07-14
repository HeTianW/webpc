import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import main from '@/components/Main'
import Pagination from '@/components/element/Pagination'
import goods from '@/components/display/goods'
import team from '@/components/display/team'
import teamDetail from '@/components/display/teamDetail'
import build from '@/components/display/build'
import speech from '@/components/display/speech'
import activity from '@/components/display/activity'
import vote from '@/components/display/vote'
import notice from '@/components/display/notice'
import comment from '@/components/display/comment'
import friend from '@/components/display/friend'

import special from '@/components/display/special'
import dialogue from '@/components/display/dialogue'
import article from '@/components/display/article'
import report from '@/components/display/report'
import answer from '@/components/display/answer'

import member from '@/components/display/member'
import memberDetail from '@/components/display/memberDetail'

import ad from '@/components/display/ad'

import disable from '@/components/display/disable'

import tag from '@/components/display/tag'

import goodtag from '@/components/display/goodtag'

import commodity from '@/components/display/commodity'

import role from '@/components/display/role'
import user from '@/components/display/user'
import school from '@/components/display/school'

import auth from '@/components/display/auth'
import feeback from '@/components/display/feeback'
import friendDetail from "../components/display/friendDetail";
import frienddynamic from "../components/display/frienddynamic";

Vue.use(Router)

const router = new VueRouter({
  // mode: 'history',

  routes: [
    {
     // path: '/login',
      path:'/',
      name: 'login',
      component: login
    },
    {
      path: '/Pagination',
      name: 'Pagination',
      component: Pagination
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children:[
        {
          path: '/teamDetail',
          name: 'teamDetail',
          component: teamDetail,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/friend',
          name: 'friend',
          component: friend,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/friendDetail',
          name: 'friendDetail',
          component: friendDetail,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/frienddynamic',
          name: 'frienddynamic',
          component: frienddynamic,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/memberDetail',
          name: 'memberDetail',
          component: memberDetail,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/commodity',
          name: 'commodity',
          component: commodity,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/auth',
          name: 'auth',
          component: auth,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/build',
          name: 'build',
          component: build,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/team',
          name: 'team',
          component: team,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/speech',
          name: 'speech',
          component: speech,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/activity',
          name: 'activity',
          component: activity,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/vote',
          name: 'vote',
          component: vote,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/notice',
          name: 'notice',
          component: notice,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/comment',
          name: 'comment',
          component: comment,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/special',
          name: 'special',
          component: special,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/dialogue',
          name: 'dialogue',
          component: dialogue,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/article',
          name: 'article',
          component: article,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/report',
          name: 'report',
          component: report,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/answer',
          name: 'answer',
          component: answer,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/member',
          name: 'member',
          component: member,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/ad',
          name: 'ad',
          component: ad,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/disable',
          name: 'disable',
          component: disable,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/tag',
          name: 'tag',
          component: tag,
          meta:{
            requireAuth: true
          }
        },

        {
          path: '/goodtag',
          name: 'goodtag',
          component: goodtag,
          meta:{
            requireAuth: true
          }
        },

        {
          path: '/role',
          name: 'role',
          component: role,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/user',
          name: 'user',
          component: user,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/school',
          name: 'school',
          component: school,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/feeback',
          name: 'feeback',
          component: feeback,
          meta:{
            requireAuth: true
          }
        },
      ],
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
  if (JSON.parse(sessionStorage.getItem("user"))) {// 判断是否登录
      next();
  } else {// 没登录则跳转到登录界面
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
    }
  } else {
        next();
  }
})

export default router;
