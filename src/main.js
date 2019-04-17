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
import {Button, Field, Cell, CellGroup, Popup, Picker, RadioGroup, Radio, Toast, Dialog, PasswordInput, Icon, Tab, Tabs, Uploader, NavBar, Rate} from 'vant'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// 获取url里的参数值
import geturlpara from './geturlpara.js'

Vue.component('shadow-box',ShadowBox)
Vue.component('page-header',PageHeader)

Vue.use(Button).use(Field).use(Cell).use(CellGroup).use(Popup).use(Picker).use(RadioGroup).use(Radio).use(Toast).use(Dialog).use(PasswordInput).use(Icon).use(Tab).use(Tabs).use(Uploader).use(NavBar).use(Rate)

Vue.use(Viewer)

Viewer.setDefaults({
  'inline':false,
  'button':true, //右上角按钮
  "navbar": false, //底部缩略图
  "title": false, //当前图片标题
  "toolbar": false, //底部工具栏
  "tooltip": false, //显示缩放百分比
  "movable": true, //是否可以移动
  "zoomable": true, //是否可以缩放
  "rotatable": true, //是否可旋转
  "scalable": true, //是否可翻转
  "transition": true, //使用 CSS3 过度
  "fullscreen": true, //播放时是否全屏
  "keyboard": false, //是否支持键盘
  "url": "data-source",
  ready: function (e) {
    console.log(e.type,'组件以初始化');
  },
  show: function (e) {
    console.log(e.type,'图片显示开始');
  },
  shown: function (e) {
    console.log(e.type,'图片显示结束');
  },
  hide: function (e) {
    console.log(e.type,'图片隐藏完成');
  },
  hidden: function (e) {
    console.log(e.type,'图片隐藏结束');
  },
  view: function (e) {
    console.log(e.type,'视图开始');
  },
  viewed: function (e) {
    console.log(e.type,'视图结束');
  },
  zoom: function (e) {
    console.log(e.type,'图片缩放开始');
  },
  zoomed: function (e) {
    console.log(e.type,'图片缩放结束');
  }
});

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
