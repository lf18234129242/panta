// 授权方法
import url from './serviceAPI.config'
import mdFive from './md5.js'
import md5 from 'js-md5';
import axios from 'axios'
var access_token = md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key)
export default {
    //获取用户 姓名、手机号
    getClientInfo(){
        let openid = localStorage.getItem('openid')
        if(!localStorage.getItem('username')){
            axios.post(url.getClientInfo,{
                access_token:access_token,
                openid:openid
            }).then(res => {
                console.log(res)
                localStorage.setItem('id',res.data.data.id)
                localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
                localStorage.setItem('username',res.data.data.username)
            }).catch(err => {
                console.log(err)
            })
        }
    },
      //  getSelfInfo   授权第一步
      getSelfInfo(){
        axios.post(url.getSelfInfo,{
            access_token:access_token
        }).then(res=> {
            console.log(res)
            // 如果用户未登录   跳转到后台返回的链接
            if(res.data.code == 1020009){
                let isError = this.$route.query.status
                // 如果 url 里面没有 isError 参数，就跳转请求连接
                if(isError==undefined || !isError){
                window.location.href = res.data.data.oauth_url;
                // 如果请求返回 ERROR ，则主动请求授权
                }else if(isError == 'ERROR'){
                // 非静默授权模式
                this.snsapi_userinfo()
                }else if(isError == 'SUCCESS'){
                // 静默授权模式
                this.snsapi_base()
                }
                return false;
            // 静默授权，获取微信名 头像 openid id
            }else if(res.data.code == 0){
                localStorage.setItem('openid',res.data.data.openid)
                localStorage.setItem('id',res.data.data.id)
                localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
                localStorage.setItem('username',res.data.data.username)
            }
        }).catch(err => {
            console.log(err)
        })
    },
      // 静默授权模式
      snsapi_base(){
        axios.post(url.getOauthRedirect,{
            access_token:access_token,
            redirect_uri:`http://www.ichevip.com/view/`,
            scope:'snsapi_base'
        }).then(res => {
            console.log(res)
            if(res.data.code == 0){
                window.location.href = res.data.data.oauth_url
            }
        }).catch(err => {
            console.log(err)
        })
    },
    // 非静默授权模式
    snsapi_userinfo(){
        axios.post(url.getOauthRedirect,{
            access_token:access_token,
            redirect_uri:`http://www.ichevip.com/view/`,
            scope:'snsapi_userinfo'
        }).then(res => {
            console.log(res)
            if(res.data.code == 0){
                window.location.href = res.data.data.oauth_url
            }
        }).catch(err => {
            console.log(err)
        })
    },
}