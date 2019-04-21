<template>
    <div class="carWasher-admin">
        <van-tabs
            type="card"
            @click="onClickTab"
            animated
            swipeable
            v-model="active"
        >
            <div class="kong"></div>
            <van-tab :title="title[index]"  v-for="(item,index) in taskList" :key="index">
                <div v-for="(item_,index_) in item.taskList_" :key="index_">
                    <router-link :to="{
                        path:'./carWasher-recording',
                        query:{
                            task_id:item_.task_id,
                            plate_number:item_.plate_number,
                            active:active
                        }
                    }">
                        <shadow-box>
                            <div class="top">
                                <li>{{item_.parking}}</li>
                                <li :class="[item_.plate_number.length == 7 ? 'blue-bg' : 'green-bg']">{{item_.plate_number}}</li>
                            </div>
                            <div class="bottom">
                                <li class="">
                                    <h3>车型信息：</h3>
                                    <h4>{{item_.car_brand}}</h4>
                                </li>
                                <li class="">
                                    <h3>车身颜色：</h3>
                                    <h4>{{item_.car_color}}</h4>
                                </li>
                            </div>
                        </shadow-box>
                    </router-link>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { Toast } from 'vant';
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
    export default {
        name:"carWasher-admin",
        data() {
            return {
                includedComponents:"carWasher-admin",
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                user_token:'',
                taskList:[
                    {taskList_:[]},
                    {taskList_:[]},
                    {taskList_:[]},
                ],
                active:1,
                title:['全部','未完成','已完成'],
            }
        },
        mounted(){
            this.active = localStorage.getItem('active') ? localStorage.getItem('active') : this.active;
            // 验证登录
            this.user_token = localStorage.getItem('user_token');
            if(!this.user_token && this.user_token !== undefined){
                this.$router.push('./CarWasher-login')
            }
            this.getTaskList_2();
        },
        watch:{
            active(){
                if(this.active == 0){
                    this.getTaskList_1();
                }else if(this.active == 1){
                    this.getTaskList_2();
                }else if(this.active == 2){
                    this.getTaskList_3();
                }
            }
        },
        methods: {
            onClickTab(index, title) {
                if(index == 0){
                    this.active == 0
                }else if(index == 1){
                    this.active == 1
                }else if(index == 2){
                    this.active == 2
                }
            },
            getTaskList_1(){
                this.axios.post(url.getTaskList,{
                    user_token:this.user_token,
                    access_token:this.access_token,
                    status:1
                }).then(res => {
                    if(res.data.code == 0){
                        this.taskList[0].taskList_ = res.data.data;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getTaskList_2(){
                this.axios.post(url.getTaskList,{
                    user_token:this.user_token,
                    access_token:this.access_token,
                    status:2
                }).then(res => {
                    if(res.data.code == 0){
                        this.taskList[1].taskList_ = res.data.data;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getTaskList_3(){
                this.axios.post(url.getTaskList,{
                    user_token:this.user_token,
                    access_token:this.access_token,
                    status:3
                }).then(res => {
                    if(res.data.code == 0){
                        this.taskList[2].taskList_ = res.data.data;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.carWasher-admin{
    width: 100%;
    position: absolute;
    .kong{
        margin-top: 2.933rem;
    }
    .ShadowBox{
        margin-top: 1.5rem;
        .top{
            width: 100%;
            height: 4.5rem;
            padding: 1rem 0  1.933rem;
            box-sizing: border-box;
            border-bottom: 1px solid #979797;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                height: 2.5rem;
                font-size: 1.067rem;
                color: #FBFBFB;
                line-height: 2.5rem;
                text-align: center;
            }
            .green-bg{
                background:rgba(85,193,91,1);
            }
            .blue-bg{
                background: #108EE9;
            }
            li:nth-child(1){
                width: 6.4rem;
                background:rgba(252,223,20,1);
                border-radius:.4rem;
            }
            li:nth-child(2){
                width:8.933rem;
                border-radius:2px;
            }
        }
        .bottom{
            width: 100%;
            height: 3.867rem;
            display: flex;
            align-items: center;
            padding-top: 1rem;
            box-sizing: border-box;
            li{
                margin-right: 1.8rem;
                h3{
                    font-size: 12px;
                    color: #606470;
                    height: 1.133rem;
                    line-height: 1.133rem;
                }
                h4{
                    font-size: 14px;
                    color: #323643;
                    height: 1.333rem;
                    line-height: 1.333rem;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.carWasher-admin{
    .van-tabs--card>.van-tabs__wrap{
        position: fixed;
        height: 2.933rem;
    }
    .van-tabs__nav--card{
        border: 1px solid #108EE9;
        width: 100%;
        height: 2.933rem;
        margin: 0;
    }
    .van-tabs__nav--card .van-tab.van-tab--active{
        background: #108EE9;
        color: #fff;
    }
    .van-tabs__nav--card .van-tab{
        border-right: 1px solid #108EE9;
        line-height: 2.933rem;
        font-size: 14px;
    }
    .van-tabs__nav--card .van-tab{
        color: #108EE9;
    }
    .van-tabs__nav--card .van-tab:last-child{
        border-right: none;
    }
}
</style>
