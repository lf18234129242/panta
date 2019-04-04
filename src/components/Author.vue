<template>
    <div>
        {{loading}}
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
    export default {
        name:'author',
        data() {
            return {
                loading: '正在登录...',
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        created(){
            // 微信获取用户 openid 
            console.log(this.$route)
            console.log(this.$route.params)
            // localStorage.setItem('openid',this.$route.query.openid)
            // localStorage.setItem('openid',this.$geturlpara.getUrlKey('openid'))
            let openid = localStorage.getItem('openid')
            console.log(`author:---${openid}`)
            let beforeURL = localStorage.getItem('beforeURL')
            if(!openid){
                //访问服务器，去授权获取 openid
                console.log(`访问服务器，去授权获取 openid`)
                this.axios.post(url.getOauthRedirect,{
                    access_token:this.access_token,
                    redirect_uri:`http://www.ichevip.com/view/author`,
                    scope:'snsapi_base'     //静默授权模式
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        window.location.href = res.data.data.oauth_url;
                    }
                }).catch(err => {
                    Toast(`获取授权失败，请稍后重试${err.data}`)
                })
            }else{
                console.log(`replace(beforeURL)`)
                this.$router.replace(beforeURL)
                this.$router.go(-1)
            }
        },
    }
</script>

<style scoped lang="scss">

</style>