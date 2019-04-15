<template>
    <div class="carWasher-login">
        <page-header
            descriptionTitle="盘他 车辆管家"
            :headerImg='headerImg'
        >
            <h2>作业人员后台登录</h2>
        </page-header>

        <div class="form">
            <van-field
                v-model="carWasher_account"
                placeholder="请输入帐号"
                label="帐号"
                left-icon="manager"
            />
            <van-field
                v-model="carWasher_password"
                placeholder="请输入密码"
                type="password"
                label="密码"
                left-icon="lock"
            />
            
            <van-button
                type="info"
                size="large"
                @click="carWasher_login"
            >登录</van-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
    export default {
        data() {
            return {
                headerImg: require('./../assets/img/car-red.png'),
                carWasher_account:'',       //洗车工帐号
                carWasher_password:'',       //洗车工密码
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        methods: {
            carWasher_login() {
                if(!this.carWasher_account){
                    Toast(`请输入帐号！`)
                }else if(!this.carWasher_password){
                    Toast(`请输入密码！`)
                }else{
                    this.axios.post(url.signIn,{
                        access_token:this.access_token,
                        phone:this.carWasher_account,
                        password:this.carWasher_password
                    }).then(res => {
                        console.log(res)
                        if(res.data.code == 0){
                            this.$router.replace('./carWasher-admin')
                            // this.$router.go(-1)
                            localStorage.setItem('user_token',res.data.data.user_token)
                            this.carWasher_account = '';
                            this.carWasher_password = '';
                        }
                    }).catch(err => {
                        console.log(err)
                        Toast(`登录失败，请稍后再试！${err}`)
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.carWasher-login{
    width: 100%;
    position: absolute;
    .PageHeader{
        h2{
            text-align: center;
            margin-top: -.467rem;
            font-size: 1.067rem;
            color: #606470;
        }
    }
    .form{
        width: 100%;
        padding: 6.333rem 2rem 6.667rem;
        box-sizing: border-box;
        .van-cell{
            width:21rem;
            height:3.2rem;
            background:rgba(255,255,255,1);
            box-shadow:0px 6px 8px 0px rgba(96,100,112,0.1);
            border-radius:.4rem;
            border:1px solid rgba(206,208,210,1);
            margin: 0 auto 2rem;
        }
        .van-button--large{
            width:21rem;
            height:3.2rem;
            background:rgba(50,119,216,1);
            border-radius:0.4rem;
            margin: 0 auto 2rem;
            display: block;
            line-height: 0;
        }
    }
}
</style>