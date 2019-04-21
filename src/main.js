// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import md5 from 'js-md5';
// import mdFive from '@/md5.js'
// import url from '@/serviceAPI.config.js'
import ShadowBox from './component/ShadowBox.vue'
import PageHeader from './component/PageHeader.vue'
import {Button, Field, Cell, CellGroup, Popup, Picker, RadioGroup, Radio, Toast, Dialog, PasswordInput, Icon, Tab, Tabs, Uploader, NavBar, Rate, Loading} from 'vant'


// 获取url里的参数值
import geturlpara from './geturlpara.js'

Vue.component('shadow-box',ShadowBox)
Vue.component('page-header',PageHeader)

Vue.use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Picker).use(RadioGroup).use(Radio).use(Toast).use(Dialog).use(PasswordInput).use(Icon).use(Tab).use(Tabs).use(Uploader).use(NavBar).use(Rate).use(Loading)


Vue.config.productionTip = false
//把 `******` 加到 `Vue` 的原型中
Vue.prototype.axios = axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$geturlpara = geturlpara 


router.beforeEach((to,from,next)=>{
  // 为页面添加标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // if(from.meta.scrollToTop==false) {
  //   sessionStorage.setItem('recordScrollTop',window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
  //   console.log(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
  //   console.log(container.scrollHeight)
  // }
  next()
})

// router.afterEach((to, from) => {
//   // 如果进入后的页面是要滚动到顶部，则设置scrollTop = 0
//   //否则从vuex中读取上次离开本页面记住的高度，恢复它
//   if(to.meta.scrollToTop==true){
//     setTimeout(()=>{
//       document.body.scrollTop = 0
//     },10)
//   }else{
//     setTimeout(()=>{
//       console.log(sessionStorage.getItem('recordScrollTop'))
//       document.body.scrollTop = sessionStorage.getItem('recordScrollTop')
//     },50)
//   }
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
