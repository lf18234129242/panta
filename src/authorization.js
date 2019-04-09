// 授权方法
import url from './serviceAPI.config'
import mdFive from './md5.js'
import md5 from 'js-md5';
import axios from 'axios'
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
// import router from './router'
// import Vue from 'vue'
// import App from './App'
// new Vue({
//     el: '#app',
//     router,
//     components: { App },
//     template: '<App/>'
// })
var access_token = md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key)
export default {
    
}