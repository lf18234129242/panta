<template>
    <div class="carWasher-recording">
        <h2>{{plate_number}}</h2>
        <van-tabs
            type="card"
            animated
            swipeable
            v-model="active"
            @click="onClickTab"
        >
            <van-tab title="洗车前">
                <van-uploader :after-read="onRead_berfore" :disabled="img_before_disabled">
                    <div class="img-box">
                        <img :src="warsher_brfore" alt="">
                    </div>
                </van-uploader>
                <van-button
                    type="info"
                    size="large"
                    :disabled = "disabled_1"
                    @click="submit_img_before"
                >提交</van-button>
            </van-tab>
            <van-tab title="洗车后">
                <van-uploader :after-read="onRead_after" :disabled="img_after_disabled">
                    <div class="img-box">
                        <img :src="warsher_after" alt="">
                    </div>
                </van-uploader>
                <van-button
                    type="info"
                    size="large"
                    :disabled = "disabled_2"
                    @click="submit_img_after"
                >提交</van-button>
            </van-tab>
        </van-tabs>
        

    </div>
</template>

<script>
import { Toast } from 'vant';
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
    export default {
        data() {
            return {
                plate_number: this.$route.query.plate_number,
                warsher_brfore:'',
                warsher_after:'',
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                img_arr_box:[],
                active:'',
                img_name:'',
                img_path:'',
                disabled_1:false,
                disabled_2:false,
                img_before_disabled:false,
                img_after_disabled:false,
            }
        },
        mounted(){
            this.axios.post(url.getRecord,{
                access_token:this.access_token,
                user_token:localStorage.getItem('user_token'),
                task_id:this.$route.query.task_id,
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            onClickTab(index, title) {
                if(index == 0){
                    this.active == 0
                }else if(index == 1){
                    this.active == 1
                }
            },
            // 提交图片
            submit_img_before() {
                this.disabled_1 = true;
                this.submit_img_finally(1);
            },
            submit_img_after() {
                this.disabled_2 = true;
                this.submit_img_finally(2);
            },
            // 选择图片
            onRead_berfore(file, detail) {
                this.warsher_brfore = file.content;
                this.img_arr_box.push(file.content)
                this.basePicUpload(this.img_arr_box);
                this.disabled_1 = false;
            },
            onRead_after(file, detail){
                this.warsher_after = file.content;
                this.img_arr_box.push(file.content)
                this.basePicUpload(this.img_arr_box);
                this.disabled_2 = false;
            },
            // 上传 base 64 图片
            basePicUpload(content){
                this.axios.post(url.basePicUpload,{
                    access_token:this.access_token,
                    imgs:content
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        this.img_name = res.data.data[0].big_img.file_name;
                        this.img_path = res.data.data[0].big_img.img_path;
                        this.img_arr_box = []
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 最后上传图片
            submit_img_finally(img_clear_status) {
                this.axios.post(url.uploadRecordImages,{
                    access_token:this.access_token,
                    user_token:localStorage.getItem('user_token'),
                    cr_id:this.$route.query.task_id,
                    img_clear_status:img_clear_status,
                    img_name:this.img_name,
                    img_path:this.img_path,
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        Toast(`上传图片成功!`)
                    }
                }).catch(err => {
                    console.log(err)
                    Toast(`上传图片失败，请稍后尝试!`)
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.carWasher-recording{
    width: 100%;
    position: absolute;
    h2{
        height: 1.667rem;
        line-height: 1.667rem;
        color: #323643;
        font-size: 18px;
        text-align: center;
        margin-top: 1.2rem;
        margin-bottom: .533rem;
    }
    h3{
        font-size: 1.333rem;
        height: 2.8rem;
        line-height: 2.8rem;
        color: #888888;
        text-align: center;
    }
    .van-uploader{
        display: block;
    }
    .img-box{
        width: 23.667rem;
        height: 12.267rem;
        margin: 4rem auto 1rem;
        background: #D8D8D8 url('./../assets/img/img_.png') no-repeat center center;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .van-button--large{
        width:21rem;
        height:3.2rem;
        background:rgba(50,119,216,1);
        border-radius:0.4rem;
        margin: 4rem auto 2rem;
        display: block;
        line-height: 0;
    }
}
</style>

<style lang="scss">
.carWasher-recording{
    .van-tabs--card>.van-tabs__wrap{
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
