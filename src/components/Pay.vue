<template>
    <div class="Pay">
        <page-header
            :headerImg="headerImg"
            descriptionTitle="选择套餐服务"
        ></page-header>
        <van-radio-group v-model="radio">
            <div
                v-for="(item,index) in packageList" 
                :key="index"
                :class="['package', radio == index ? 'borderBlue' : 'borderEEE']" 
                @click="checkRadio(index)"
            >
                <div class="top">
                    <li class="img">
                        <img src="./../assets/img/car-green.png" alt="">
                    </li>
                    <li class="center">
                        <span>
                            {{item.package_name}}
                            <em v-if="item.rest_cnt || item.rest_cnt == 0">剩余<i :class="[item.rest_cnt == 0 ? 'red-color' : '']">{{item.rest_cnt}}</i>份</em>
                        </span>
                        <p>{{item.package_title}}</p>
                    </li>
                    <li class="radio">
                        <van-radio :name="index" :disabled="item.rest_cnt == 0" @click="checkRadio(index)"></van-radio>
                    </li>
                </div>
                <div class="bottom">
                    {{item.package_explain}}<br>
                    到期时间：{{item.over_time}}
                </div>
            </div>
        </van-radio-group>
        <!-- 微信支付 -->
        <van-button
            type="info"
            size="large"
            :disabled="wechatPay_button"
            @click="wechatPay"
        >微信支付</van-button>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
import wx from 'weixin-js-sdk'
    export default {
        data() {
            return {
                headerImg: require('./../assets/img/car-green.png'),
                radio: 0,
                packageList:[],
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                car_id:'',          //用户选择的车辆id号
                order_id:'',     //订单 id
                wechatPay_button:false
            }
        },
        mounted(){
            this.car_id = this.$route.query.car_id;
            this.axios.post(url.getOrderPackageList,{
                access_token:this.access_token,
                car_id:this.car_id
            }).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.packageList = res.data.data;
                    if(this.packageList[0].rest_cnt == 0){
                        this.radio = 1;
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            // 选择套餐
            checkRadio(index){
                if(this.packageList[index].over_self_limits == 0){
                    Toast('每人限购1次！')
                }else if(this.packageList[index].rest_cnt == 0){
                    Toast('体验卡已被抢购一空，请选择其他套餐！')
                }else{
                    this.radio = index;
                }
            },
            // 下单
            wechatPay(){
                this.wechatPay_button = true;
                this.axios.post(url.createOrder,{
                    access_token:this.access_token,
                    car_id:this.car_id,
                    package_id:this.packageList[this.radio].id,         //用户选择的套餐id
                    unit_price:this.packageList[this.radio].price,      //套餐单价
                    total_price:this.packageList[this.radio].price,     //套餐总价
                }).then(res => {
                    console.log(res)
                    // 如果下单成功，进入微信支付
                    if(res.data.code == 0){
                        this.order_id = res.data.data.order_id;
                        this.axios.post(url.getWxVoucher,{
                            access_token:this.access_token,
                            url:'http://www.ichevip.com/view/pay',
                            id:this.order_id
                        }).then(response => {
                            console.log(response)
                            let configJson = JSON.parse(response.data.data.configJson);
                            console.log(configJson)
                            wx.config({
                                debug: configJson.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                                appId: configJson.appId, // 必填，公众号的唯一标识
                                timestamp: configJson.timestamp, // 必填，生成签名的时间戳
                                nonceStr: configJson.nonceStr, // 必填，生成签名的随机串
                                signature: configJson.signature,// 必填，签名，见附录1
                                jsApiList: [
                                    configJson.jsApiList
                                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });

                            wx.ready(function () {
                                let options = response.data.data.options;
                                console.log(options)
                                if(options){
                                    // 支付成功后的操作
                                    options.success = function () {
                                        window.location.href = `http://www.ichevip.com/view/`;
                                    };
                                    
                                    //  取消支付的操作
                                    options.cancel = function () {
                                        pay_order = true;
                                    };
                                    
                                    // 支付失败的处理 
                                    options.fail = function () {
                                        pay_order = true;
                                    };
                                    // 传入参数，发起JSAPI支付
                                    wx.chooseWXPay(options);
                                }else{
                                    Toast(`支付失败，请稍后再试！`)
                                }
                            })
                        }).catch(error => {
                            Toast(`下单失败，请稍后再试！${error}`)
                        })
                    }else{
                        Toast('下单失败，请核对您所填信息是否正确后再试！')
                    }
                }).catch(err => {
                    Toast(`下单失败，请稍后再试！${err}`)
                })
            }
        },
    }
</script>

<style scoped lang="scss">
.Pay{
    width: 100%;
    position: absolute;
    .borderBlue{
        border:.1rem solid rgba(50,119,216,1);
    }
    .borderEEE{
        border:.1rem solid rgba(217,217,217,1);
    }
    .package{
        width:24.333rem;
        // height:11.667rem;
        background:rgba(255,255,255,1);
        box-shadow:0px 4px 8px 0px rgba(0,0,0,0.04);
        border-radius:.533rem;
        margin: 0 auto 1.4rem;
        padding: 1.5rem 2.5rem;
        box-sizing: border-box;
        .top{
            display: flex;
            width: 100%;
            height: 5.4rem;
            border-bottom: 1px dashed #CFCFCF;
            align-items: center;
            .img{
                width: 2.8rem;
                height: 2.8rem;
                border-radius: 50%;
                margin-right: 1.533rem;
                margin-left: -.933rem;
                img{
                    width: 100%;
                    height: auto;
                }
            }
            .center{
                height: 5.4rem;
                width: 15.133rem;
                span{
                    display: block;
                    font-size: .867rem;
                    color: #555555;
                    height: 1.733rem;
                    line-height: 1.733rem;
                    margin-bottom: .4rem;
                }
                i{
                    font-size: .867rem;
                    line-height: 1.733rem;
                }
                .red-color{
                    color: red;
                }
                p{
                    font-size: 1.667rem;
                    color: #111111;

                }
            }
            .radio{
                margin-top: 1.2rem;
            }
        }
        .bottom{
            // height: 1.2rem;
            font-size: .867rem;
            color: #888888;
            margin-top: 1rem;
            margin-left: 3.533rem;
        }
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
</style>