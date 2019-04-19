<template>
    <div class="User-rate">
        <van-nav-bar title="2018年3月1日" @click-right="onClickRight">
            <van-icon name="bell" slot="right" />
        </van-nav-bar>

        <header>
            <li><img src="./../assets/img/car-red.jpg" alt=""></li>
            <li>
                <h2>{{nickname}}</h2>
                <h3>{{r_name}}</h3>
            </li>
        </header>

        <section>
            <h2>洗车前</h2>
            <div class="img-box" @click="show_before_img">
                <img :src="warsher_before_img" alt="">
            </div>
            <h2>洗车后</h2>
            <div class="img-box" @click="show_after_img">
                <img :src="warsher_after_img" alt="">
            </div>
        </section>

        <!-- 服务评价 -->
        <div class="rate" v-if="is_show_rate">
            <p>服务评价</p>
            <van-rate v-model="rate_num"/>
        </div>

        <van-button
            type="info"
            size="large"
            v-if="is_show_rate"
            :disabled = "disabled_button"
            @click="submit_rate"
        >提交评价</van-button>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import { Toast, ImagePreview} from 'vant';
    export default {
        data() {
            return {
                warsher_before_img: '',
                warsher_after_img:'',
                cr_id:'',
                rate_num:0,    //评价几颗星
                nickname:'',    //洗车工名称
                r_name:'',    //小区地址
                disabled_button:false,
                is_show_rate:true,
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                instance_before:'',
                instance_after:'',
            }
        },
        mounted(){
            this.cr_id = this.$route.query.cr_id;
            this.axios.post(url.getClearRecordDetail,{
                access_token:this.access_token,
                cr_id:this.cr_id
            }).then(res => {
                console.log(res)
                if(res.data.data.star_level){
                    this.is_show_rate = false;
                }else{
                    this.is_show_rate = true;
                }
                this.nickname = res.data.data.nickname
                this.r_name = res.data.data.r_name
                this.warsher_before_img = res.data.data.before_img.img_url
                this.warsher_after_img = res.data.data.after_img.img_url

            }).catch(err => {
                console.log(err)
            })
        },
        destroyed(){
            if(this.active == 0){
                this.instance_before.close();
            }else if(this.active == 1){
                this.instance_after.close();
            }
        },
        methods: {
            //查看图片
            show_before_img(){
                this.active = 0;
                this.instance_before = ImagePreview({
                    images: [this.warsher_before_img],
                });
            },
            show_after_img(){
                this.active = 1;
                this.instance_after = ImagePreview({
                    images: [this.warsher_after_img],
                });
            },
            onClickRight() {
                this.$router.push('/feedback')
            },
            submit_rate(){
                this.disabled_button = true;
                this.axios.post(url.setStarLevel,{
                    access_token:this.access_token,
                    star_level:this.rate_num,
                    cr_id:this.cr_id
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        Toast('提交成功！')
                        this.is_show_rate = false;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.User-rate{
    width: 100%;
    position: absolute;
    .van-nav-bar .van-icon{
        color: #323643;
        font-size: 1.067rem;
    }
    header{
        width: 100%;
        padding: 1.733rem 3.067rem .733rem;
        box-sizing: border-box;
        // background: #efefef;
        display: flex;
        li:nth-child(1){
            width: 4.133rem;
            height: 4.133rem;
            margin-right: 2.933rem;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        li:nth-child(2){
            h2{
                font-size: 22px;
                color: #323643;
                height: 2rem;
                line-height: 2rem;
                margin-bottom: .667rem;
            }
            h3{
                font-size: 16px;
                color: #606470;
                height: 1.467rem;
                line-height: 1.467rem;
            }
        }
    }
    section{
        h2{
            font-size: 20px;
            height: 2.8rem;
            line-height: 2.8rem;
            color: #888;
            text-align: center;
        }
        .img-box{
            width: 23.667rem;
            height: 12.267rem;
            margin: 0 auto 1rem;
            background: #D8D8D8 url('./../assets/img/img_.png') no-repeat center center;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .rate{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        p{
            font-size: 18px;
            color: #323643;
            text-align: center;
            width: 100%;
            height: 1.667rem;
            line-height: 1.667rem;
            margin-bottom: 1.233rem;
        }
    }
    .van-button--large{
        width:21rem;
        height:3.2rem;
        background:rgba(50,119,216,1);
        border-radius:0.4rem;
        margin: 1rem auto 2rem;
        display: block;
        line-height: 0;
    }
}
</style>