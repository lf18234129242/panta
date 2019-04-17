<template>
    <div class="washer-record">
        <van-nav-bar title="车辆服务信息" @click-right="onClickRight">
            <van-icon name="bell" slot="right" />
        </van-nav-bar>
        <h2 class="warn">只展示最近30天的服务信息</h2>

        <shadow-box v-for="(item,index) in recordList" :key="index">
            <router-link :to="{path:'/user-rate',query:{cr_id:item.cr_id}}">
                <ul>
                    <li class="left">
                        <van-icon name="location"></van-icon>
                        <div></div>
                        <van-icon name="flag-o"></van-icon>
                    </li>
                    <li class="center">
                        <p>{{item.time}}</p>
                        <p>{{item.r_name}}</p>
                    </li>
                    <li class="right">
                        <p>{{item.date}}</p>
                        <van-rate v-model="item.star_level" readonly />
                    </li>
                </ul>
            </router-link>
        </shadow-box>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
    export default {
        data() {
            return {
                recordList:[],
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        mounted(){
            this.axios.post(url.getClearRecordList,{
                access_token:this.access_token
            }).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.recordList = res.data.data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            onClickRight() {
                this.$router.push('/feedback')
            }
        },
    }
</script>

<style lang="scss" scoped>
.flex-between{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.washer-record{
    width: 100%;
    position: absolute;
    .van-nav-bar .van-icon{
        color: #323643;
        font-size: 1.067rem;
    }
    .warn{
        width:100%;
        height:1.333rem;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(50,119,216,1);
        line-height:1.333rem;
        margin: 1.667rem 0 1.333rem 0;
        padding-left: 1.067rem;
        box-sizing: border-box;
    }
    .ShadowBox{
        ul{
            display: flex;
            justify-content: space-between;
            .left{
                width: 1rem;
                height: 4.333rem;
                @extend .flex-between;
                align-items: center;
                margin-right: 0.5rem;
                div{
                    width: 1px;
                    height: 1.867rem;
                    background-image: repeating-linear-gradient(0deg, #CED0D2 3px, #fff  3px, #fff 6px, #CED0D2 6px, #CED0D2 9px);
                }
                .van-icon:nth-of-type(2){
                    color: #3277D8;
                }
            }
            .center, .right{
                height: 4.333rem;
                @extend .flex-between;
            }
            .center{
                flex: 1;
            }
            .right{
                .van-rate__item{
                    font-size: 10px!important;
                    padding: 0 1px;
                }
            }
        }
    }
}
</style>