// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import md5 from 'js-md5';
import mdFive from '@/md5.js'
import url from '@/serviceAPI.config.js'
import ShadowBox from './component/ShadowBox.vue'
import PageHeader from './component/PageHeader.vue'
import {Button, Field, Cell, CellGroup, Popup, Picker, RadioGroup, Radio, Toast, Dialog} from 'vant'

// 获取url里的参数值
import geturlpara from './geturlpara.js'

Vue.component('shadow-box',ShadowBox)
Vue.component('page-header',PageHeader)

Vue.use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Picker).use(RadioGroup).use(Radio).use(Toast).use(Dialog)

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
  
  let access_token = md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key);

  // 将用户第一次进入的页面保存到本地
  // localStorage.setItem('beforeURL',to.path)

  // 验证所有的页面，是否登录
  if(to.matched.some(m => m.meta.auth)){
    // let toHelloTimes = 0;
    // if(to.path == '/'){
    //   toHelloTimes++;
    // }
    let openid = localStorage.getItem('openid');
    if(openid == undefined || !openid){
      axios.post(url.getSelfInfo,{
        access_token:access_token
      }).then(res=> {
        console.log(res)
        // 如果用户未登录   跳转到后台返回的链接
        if(res.data.code == 1020009){
          window.location.href = res.data.data.oauth_url;
          return false;
        // 静默授权，获取微信名 头像 openid id
        }else if(res.data.code == 0){
          localStorage.setItem('openid',res.data.data.openid)
          localStorage.setItem('id',res.data.data.id)
          localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
          localStorage.setItem('username',res.data.data.username)
          console.log(localStorage.getItem('openid'))

        }
      }).catch(err => {
        console.log(err)
      })
    }else if(openid && openid !== undefined){
      //  获取用户 姓名、手机号
      if(!localStorage.getItem('username')){
        console.log('获取用户 姓名、手机号')
        axios.post(url.getClientInfo,{
          access_token:access_token,
          openid:openid
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    }
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
