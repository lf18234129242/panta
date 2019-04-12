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
import {Button, Field, Cell, CellGroup, Popup, Picker, RadioGroup, Radio, Toast, Dialog, PasswordInput, Icon} from 'vant'

// 获取url里的参数值
import geturlpara from './geturlpara.js'

Vue.component('shadow-box',ShadowBox)
Vue.component('page-header',PageHeader)

Vue.use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Picker).use(RadioGroup).use(Radio).use(Toast).use(Dialog).use(PasswordInput).use(Icon)

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
  next()
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
