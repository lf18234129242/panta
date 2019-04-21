<template>
    <div class="carWasher-recording">
        <h2>{{plate_number}}</h2>
        <van-tabs
            type="card"
            animated
            swipeable
            v-model="active_"
            @click="onClickTab"
        >
            <van-tab title="洗车前">
                <van-uploader :after-read="onRead_before" v-if="img_before_disabled">
                    <div class="img-box pr">
                        <img :src="warsher_before" alt="">
                        <div class="Circle" v-if="isShow_loading_before">
                            <van-loading color="white" />
                        </div>
                    </div>
                </van-uploader>
                <div class="img-box" v-else-if="!img_before_disabled" @click.stop="show_before_img">
                    <img :src="warsher_before" alt="">
                </div>
                <van-button
                    type="info"
                    size="large"
                    :disabled = "disabled_1"
                    v-if="is_show_before_button"
                    @click="submit_img_before"
                >提交</van-button>
            </van-tab>
            <van-tab title="洗车后">
                <van-uploader :after-read="onRead_after" v-if="img_after_disabled">
                    <div class="img-box pr">
                        <img :src="warsher_after" alt="">
                        <div class="Circle" v-if="isShow_loading_after">
                            <van-loading color="white" />
                        </div>
                    </div>
                </van-uploader>
                <div class="img-box" v-else-if="!img_after_disabled" @click.stop="show_after_img">
                    <img :src="warsher_after" alt="">
                </div>
                <van-button
                    type="info"
                    size="large"
                    :disabled = "disabled_2"
                    v-if="is_show_after_button"
                    @click="submit_img_after"
                >提交</van-button>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { Toast, ImagePreview} from 'vant';
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
    export default {
        data() {
            return {
                plate_number: this.$route.query.plate_number,
                warsher_before:'',
                warsher_after:'',
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                img_arr_box_before:[],
                img_arr_box_after:[],
                active_:'',
                img_name:'',
                img_path:'',
                disabled_1:false,
                disabled_2:false,
                is_show_before_button:true,
                is_show_after_button:true,
                img_before_disabled:true,
                img_after_disabled:true,
                id:'',      //上传图片所需 id
                active:'',      //上个页面跳转过来时的tab 数字
                instance_before:'',
                instance_after:'',
                isShow_loading_before:false,     //是否显示图片上传loading
                isShow_loading_after:false,     //是否显示图片上传loading
            }
        },
        mounted(){
            this.active = this.$route.query.active;
            localStorage.setItem('active',this.active)
            this.axios.post(url.getRecord,{
                access_token:this.access_token,
                user_token:localStorage.getItem('user_token'),
                task_id:this.$route.query.task_id,
            }).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.id = res.data.data.id
                    this.warsher_before = res.data.data.before_img.img_url
                    this.warsher_after = res.data.data.after_img.img_url
                    // 如果获取到图片，禁用上传图片功能，隐藏提交 button
                    if(this.warsher_before && this.warsher_before !== undefined){
                        this.is_show_before_button = false;
                        this.img_before_disabled = false;
                    }
                    if(this.warsher_after && this.warsher_after !== undefined){
                        this.is_show_after_button = false;
                        this.img_after_disabled = false;
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        destroyed(){
            if(this.active_ == 0 && this.instance_before){
                this.instance_before.close();
            }else if(this.active_ == 1 && this.instance_after){
                this.instance_after.close();
            }
        },
        methods: {
            //查看图片
            show_before_img(){
                this.instance_before = ImagePreview({
                    images: [this.warsher_before],
                });
            },
            show_after_img(){
                this.instance_after = ImagePreview({
                    images: [this.warsher_after],
                });
            },
            onClickTab(index, title) {
                if(index == 0){
                    this.active_ == 0
                }else if(index == 1){
                    this.active_ == 1
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
            onRead_before(file, detail) {
                this.isShow_loading_before = true;
                this.warsher_before = file.content;
                this.img_arr_box_before.push(file.content)
                this.basePicUpload(this.img_arr_box_before);
                this.disabled_1 = true;
            },
            onRead_after(file, detail){
                this.isShow_loading_after = true;
                this.warsher_after = file.content;
                this.img_arr_box_after.push(file.content)
                this.basePicUpload(this.img_arr_box_after);
                this.disabled_2 = true;
            },
            // 上传 base 64 图片
            basePicUpload(content){
                this.axios.post(url.basePicUpload,{
                    access_token:this.access_token,
                    imgs:content
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        this.isShow_loading_before = false;
                        this.isShow_loading_after = false;
                        this.img_name = res.data.data[0].real_img.file_name;
                        this.img_path = res.data.data[0].real_img.img_path;
                        this.img_arr_box_before = []
                        this.img_arr_box_after = []
                        this.disabled_1 = false;
                        this.disabled_2 = false;
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
                    cr_id:this.id,
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
        .Circle{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
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
