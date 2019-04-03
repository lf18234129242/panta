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
                @click="radio = index"
            >
                <div class="top">
                    <li class="img">
                        <img src="./../assets/img/car-green.png" alt="">
                    </li>
                    <li class="center">
                        <span>{{item.cardType}}</span>
                        <p>{{item.cardTypeDetail}}</p>
                    </li>
                    <li class="radio">
                        <van-radio :name="index"></van-radio>
                    </li>
                </div>
                <div class="bottom">
                    {{item.cardTypeTime}}
                </div>
            </div>
        </van-radio-group>
        <!-- 微信支付 -->
        <van-button
            type="info"
            size="large"
            @click="wechatPay"
        >微信支付</van-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                headerImg: require('./../assets/img/car-green.png'),
                radio: 0,
                packageList:[
                    {
                        cardType:'体验卡',
                        cardTypeDetail:'免费洗三天',
                        cardTypeTime:'新用户专享',
                    },
                    {
                        cardType:'月卡',
                        cardTypeDetail:'99元洗车30天',
                        cardTypeTime:'到期时间为2018年5月1日',
                    },
                ],
            }
        },
        methods: {
            wechatPay(){

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
        height:10.667rem;
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
            // justify-content: center;
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
                // display: flex;
                span{
                    display: block;
                    font-size: .867rem;
                    color: #555555;
                    height: 1.733rem;
                    line-height: 1.733rem;
                    margin-bottom: .4rem;
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
            height: 1.2rem;
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
        margin: 0 auto;
        display: block;
        line-height: 0;
    }
}
</style>