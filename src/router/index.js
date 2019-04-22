import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${view}.vue`)
}

export default new Router({
  mode: 'history',
  base: 'view',
  // scrollBehavior (to, from, savedPosition) {
    //判断如果滚动条的位置存在直接返回到当前位置，否者返回到起点
    // if (savedPosition) {
    //   console.log(savedPosition)
    //   setTimeout(() => {
    //     return savedPosition
    //   }, 200);
    // } else {
    //   const position = {}
    //   if (to.hash) {
    //     position.selector = to.hash
    //     console.log(to.hash)
    //     // return {selector: to.hash}
    //   }
    //   if (to.matched.some(m => m.meta.scrollToTop)) {
    //     position.x = 0
    //     position.y = 0
    //   }
    //   return position
    // }
  // },
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: loadView('HelloWorld'),
      meta:{
        index:2,
        auth:true,
        title:'用户中心',
        scrollToTop:true,
      }
    },
    {
      path: '/addCarInfo',
      name: 'AddCarInfo',
      component: loadView('AddCarInfo'),
      meta:{
        index:3,
        auth:true,
        title:'绑定车辆信息',
        scrollToTop:true,
      }
    },
    {
      path: '/pay',
      name: 'Pay',
      component: loadView('Pay'),
      meta:{
        index:4,
        auth:true,
        title:'支付',
        scrollToTop:true,
      }
    },
    {
      path: '/user-rate',
      name: 'User-rate',
      component: loadView('User-rate'),
      meta:{
        index:4,
        auth:true,
        title:'评价打分',
        scrollToTop:true,
      }
    },
    {
      path: '/washer-record',
      name: 'Washer-record',
      component: loadView('Washer-record'),
      meta:{
        index:3,
        auth:true,
        title:'洗车记录',
        scrollToTop:true,
      }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: loadView('Feedback'),
      meta:{
        index:5,
        auth:true,
        title:'反馈建议',
        scrollToTop:true,
      }
    },
    {
      path: '/author',
      name: 'Author',
      component: loadView('Author'),
      meta:{
        index:1,
        auth:true,
        title:'正在登录',
        scrollToTop:true,
      }
    },
    {
      path: '/carWasher-login',
      name: 'CarWasher-login',
      component: loadView('CarWasher-login'),
      meta:{
        index:1,
        auth:true,
        title:'登录',
        scrollToTop:true,
      }
    },
    {
      path: '/carWasher-admin',
      name: 'CarWasher-admin',
      component: loadView('CarWasher-admin'),
      meta:{
        index:2,
        auth:true,
        title:'操作后台',
        scrollToTop:false,
      }
    },
    {
      path: '/carWasher-recording',
      name: 'CarWasher-recording',
      component: loadView('CarWasher-recording'),
      meta:{
        index:3,
        auth:true,
        title:'洗车记录',
        scrollToTop:true,
      }
    },
  ]
})