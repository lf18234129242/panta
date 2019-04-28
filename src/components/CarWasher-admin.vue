<template>
    <div class="carWasher-admin" ref="car_washer_admin">
        <van-tabs
            type="card"
            @click="onClickTab"
            animated
            swipeable
            v-model="active"
        >
            <div class="kong"></div>
            <van-tab :title="title[index]"  v-for="(item,index) in taskList" :key="index">
            <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div
                    v-for="(item_,index_) in item.taskList_" 
                    :key="index_" 
                >
                    <router-link :to="{
                        path:'./carWasher-recording',
                        query:{
                            task_id:item_.task_id,
                            plate_number:item_.plate_number,
                            active:active,
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
                                <li class="">
                                    <h3>到期时间：</h3>
                                    <h4>{{item_.over_time | over_time}}</h4>
                                </li>
                            </div>
                        </shadow-box>
                    </router-link>
                </div>
            </van-pull-refresh>
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
                reload:false,   //从登录页过来是否重新加载
                taskList:[
                    {taskList_:[]},
                    {taskList_:[]},
                    {taskList_:[]},
                ],
                active:1,
                offsetTop_num:0,
                index_dom:0,
                title:['全部','未完成','已完成'],
                isLoading: false,       //下拉刷新
            }
        },
        created(){
                // 验证登录
            this.user_token = localStorage.getItem('user_token') ? localStorage.getItem('user_token') : this.$route.query.user_token;

            this.active = sessionStorage.getItem('active') ? sessionStorage.getItem('active') : this.active;
            
            if(this.active == 0){
                this.getTaskList(1);
            }else if(this.active == 1){
                this.getTaskList(2);
            }else if(this.active == 2){
                this.getTaskList(3);
            }
        },
        filters:{
            over_time(value){
                return value.substring(0,10)
            },
        },
        methods: {
            // 下拉刷新
            onRefresh() {
                setTimeout(() => {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                    if(this.active == 0){
                        this.getTaskList(1);
                    }else if(this.active == 1){
                        this.getTaskList(2);
                    }else if(this.active == 2){
                        this.getTaskList(3);
                    }
                }, 500);
            },

            onClickTab(index, title) {
                if(index == 0){
                    this.active == 0
                        this.getTaskList(1);
                }else if(index == 1){
                    this.active == 1
                        this.getTaskList(2);
                }else if(index == 2){
                    this.active == 2
                        this.getTaskList(3);
                }
            },
            getTaskList(statusNum){
                this.axios.post(url.getTaskList,{
                    user_token:this.user_token,
                    access_token:this.access_token,
                    status:statusNum
                }).then(res => {
                    if(res.data.code == 0){
                        this.taskList[statusNum-1].taskList_ = res.data.data;
                        console.log(this.taskList[statusNum-1].taskList_)
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
                margin-right: 1rem;
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
