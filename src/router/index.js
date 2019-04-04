import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/components/${view}.vue`)
}

export default new Router({
  mode: 'history',
  base: 'view',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: loadView('HelloWorld'),
      meta:{
        index:2,
        auth:true,
        title:'用户中心'
      }
    },
    {
      path: '/addCarInfo',
      name: 'AddCarInfo',
      component: loadView('AddCarInfo'),
      meta:{
        index:3,
        auth:true,
        title:'绑定车辆信息'
      }
    },
    {
      path: '/pay',
      name: 'Pay',
      component: loadView('Pay'),
      meta:{
        index:4,
        auth:true,
        title:'支付'
      }
    },
    {
      path: '/author',
      name: 'Author',
      component: loadView('Author'),
      meta:{
        index:1,
        auth:true,
        title:'正在登录'
      }
    },
  ]
})