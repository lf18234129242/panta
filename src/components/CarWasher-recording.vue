<template>
    <div class="carWasher-recording">
        <van-nav-bar
            :title="plate_number"
            left-text="返回"
            @click-left="onClickLeft"
        >
            <van-icon name="wap-home" slot="left" />
        </van-nav-bar>
        <van-tabs
            type="card"
            animated
            swipeable
            v-model="active_"
            @click="onClickTab"
            @disabled="showToast"
        >
            <van-tab title="洗车前">
                <van-uploader
                    :after-read="onRead_before"
                    v-if="img_before_disabled"
                >
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
                >确认上传</van-button>
            </van-tab>
            <van-tab title="洗车后" :disabled="isFirstUpload">
                <van-uploader
                    :after-read="onRead_after"
                    v-if="img_after_disabled"
                >
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
                <div class="checkbox" v-if="is_show_after_button">
                    <van-checkbox v-model="checked_1">车位与车牌不符</van-checkbox>
                    <van-checkbox v-model="checked_2">2:00前未在指定车位发现车辆</van-checkbox>
                </div>
                <div class="checkbox" v-else>
                    <p v-if="special_cases[0] == 1">车位与车牌不符</p>
                    <p v-if="special_cases[1] == 2">2:00前未在指定车位发现车辆</p>
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
import { Toast, ImagePreview } from 'vant';
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import EXIF from 'exif-js'
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
                img_name_before:'',
                img_path_before:'',
                img_name_after:'',
                img_path_after:'',
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
                checked_1:false,        //复选框
                checked_2:false,        //复选框
                checked_arr:[],        //复选框提交数组
                isFirstUpload:true, // 判断第一张图片是否上传，如果没有上传，不可跳到第二个 tab
                special_cases:[],
            }
        },
        mounted(){
            this.active = this.$route.query.active;
            sessionStorage.setItem('active',this.active)
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
                        this.isFirstUpload = false;
                    }
                    if(this.warsher_after && this.warsher_after !== undefined){
                        this.is_show_after_button = false;
                        this.img_after_disabled = false;
                        this.isFirstUpload = false;
                    }
                    this.special_cases = JSON.parse(res.data.data.special_cases);
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
        watch:{
            checked_1(){
                if(this.checked_1){
                    this.checked_arr.push(1);
                    this.checked_arr.sort()
                }else{
                    this.checked_arr.splice(this.checked_arr.indexOf(1),1)
                }
            },
            checked_2(){
                if(this.checked_2){
                    this.checked_arr.push(2);
                    this.checked_arr.sort()
                }else{
                    this.checked_arr.splice(this.checked_arr.indexOf(2),1)
                }
            },
        },
        methods: {
            // 返回上一个页面
            onClickLeft(){
                this.$router.go(-1)
            },
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
            // 判断第一张图片是否上传，如果没有上传，不可跳到第二个 tab
            showToast(){
                Toast('请先上传洗车前的图片！')
            },
            // 提交图片
            submit_img_before() {
                this.disabled_1 = true;
                this.submit_img_finally(1,this.img_name_before,this.img_path_before);
            },
            submit_img_after() {
                this.disabled_2 = true;
                this.submit_img_finally(2,this.img_name_after,this.img_path_after);
            },
            // 选择图片
            onRead_before(file, detail) {
                var this_ = this;
                this.isShow_loading_before = true;
                var image = new Image,
                    Orientation;
                image.src = file.content;
                image.onload = function(){
                    EXIF.getData(image, function() {  
                        Orientation = EXIF.getTag(this, 'Orientation');
                    });
                    var imgWidth = this.width,
                        imgHeight = this.height;
                    if(imgWidth > imgHeight && imgWidth > 1500){
                        imgWidth = 1500;
                        imgHeight = Math.ceil(1500 * this.height / this.width);
                    }else if(imgWidth < imgHeight && imgHeight > 1500){
                        imgWidth = Math.ceil(1500 * this.width / this.height);
                        imgHeight = 1500;
                    }
                    var canvas =  document.createElement('canvas')
                    let ctx = canvas.getContext('2d') 
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    if(Orientation && Orientation != 1){
                        switch(Orientation){
                            case 6:     // 旋转90度
                                // alert(6)
                                canvas.width = imgHeight;    
                                canvas.height = imgWidth;    
                                ctx.rotate(Math.PI / 2);
                                // (0,-imgHeight) 从旋转原理图那里获得的起始点
                                ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
                                break;
                            case 3:     // 旋转180度
                                // alert(3)
                                ctx.rotate(Math.PI);    
                                ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
                                break;
                            case 8:     // 旋转-90度
                                // alert(8)
                                canvas.width = imgHeight;    
                                canvas.height = imgWidth;    
                                ctx.rotate(3 * Math.PI / 2);    
                                ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
                                break;
                        }
                    }else{
                        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
                    }
                    this_.warsher_before = canvas.toDataURL(file.file.type, 0.95);
                    console.log(this_.img_arr_box_before)
                    this_.img_arr_box_before.push(this_.warsher_before)
                    console.log(this_.img_arr_box_before)
                    this_.basePicUpload_before();
                    this_.disabled_2 = true;
                }
            },
            onRead_after(file, detail){
                var this_ = this;
                this.isShow_loading_after = true;
                var image = new Image,
                    Orientation;
                image.src = file.content;
                
                image.onload = function(){
                    EXIF.getData(image, function() {  
                        Orientation = EXIF.getTag(this, 'Orientation');
                    });
                    var imgWidth = this.width,
                        imgHeight = this.height;
                    if(imgWidth > imgHeight && imgWidth > 1500){
                        imgWidth = 1500;
                        imgHeight = Math.ceil(1500 * this.height / this.width);
                    }else if(imgWidth < imgHeight && imgHeight > 1500){
                        imgWidth = Math.ceil(1500 * this.width / this.height);
                        imgHeight = 1500;
                    }
                    var canvas =  document.createElement('canvas')
                    let ctx = canvas.getContext('2d') 
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    if(Orientation && Orientation != 1){
                        switch(Orientation){
                            case 6:     // 旋转90度
                                // alert(6)
                                canvas.width = imgHeight;    
                                canvas.height = imgWidth;    
                                ctx.rotate(Math.PI / 2);
                                // (0,-imgHeight) 从旋转原理图那里获得的起始点
                                ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
                                break;
                            case 3:     // 旋转180度
                                // alert(3)
                                ctx.rotate(Math.PI);    
                                ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
                                break;
                            case 8:     // 旋转-90度
                                // alert(8)
                                canvas.width = imgHeight;    
                                canvas.height = imgWidth;    
                                ctx.rotate(3 * Math.PI / 2);    
                                ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
                                break;
                        }
                    }else{
                        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
                    }
                    this_.warsher_after = canvas.toDataURL(file.file.type, 0.95);
                    console.log(this_.img_arr_box_after)
                    this_.img_arr_box_after.push(this_.warsher_after)
                    console.log(this_.img_arr_box_after)
                    this_.basePicUpload_after();
                    this_.disabled_2 = true;
                }
                // if(/\/(?:jpeg|png)/i.test(file.file.type)&&file.file.size>2000000) {
                //     let canvas =  document.createElement('canvas')  
                //     let context = canvas.getContext('2d') 
                //     let img = new Image()
                //     img.src = file.content
                //     img.onload = () => {
                //         canvas.width = 2000
                //         canvas.height = 2000
                //         context.drawImage(img, 0, 0, 2000, 2000)
                //         file.content = canvas.toDataURL(file.file.type, 0.95) 
                //         this.warsher_after = file.content;
                //         this.img_arr_box_after.push(file.content)
                //         this.basePicUpload_after();
                //     }                       
                // }else{
                //     this.warsher_after = file.content;
                //     this.img_arr_box_after.push(file.content)
                //     this.basePicUpload_after();
                // }
            },
            // 上传 base 64 图片
            basePicUpload_before(){
                this.axios.post(url.basePicUpload,{
                    access_token:this.access_token,
                    imgs:this.img_arr_box_before
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        this.isShow_loading_before = false;
                        this.img_name_before = res.data.data[0].real_img.file_name;
                        this.img_path_before = res.data.data[0].real_img.img_path;
                        this.img_arr_box_before = []
                        this.disabled_1 = false;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            basePicUpload_after(){
                this.axios.post(url.basePicUpload,{
                    access_token:this.access_token,
                    imgs:this.img_arr_box_after
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        this.isShow_loading_after = false;
                        this.img_name_after = res.data.data[0].real_img.file_name;
                        this.img_path_after = res.data.data[0].real_img.img_path;
                        this.img_arr_box_after = []
                        this.disabled_2 = false;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 最后上传图片
            submit_img_finally(img_clear_status,img_name,img_path) {
                this.axios.post(url.uploadRecordImages,{
                    access_token:this.access_token,
                    user_token:localStorage.getItem('user_token'),
                    cr_id:this.id,
                    img_clear_status:img_clear_status,
                    img_name:img_name,
                    img_path:img_path,
                    special_cases:this.checked_arr,
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        Toast(`上传图片成功!`)
                        this.isFirstUpload = false;
                        if(this.active_ == 0){
                            this.active_ = 1;
                        }else{
                            this.$router.push('/carWasher-admin')
                        }
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
    .van-nav-bar .van-icon{
        font-size: 20px;
    }
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
        height: 23.667rem;
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
    .checkbox{
        width: 100%;
        padding: .667rem 0 0 3.667rem;
        box-sizing: border-box;
        .van-checkbox{
            margin-bottom: 0.5rem;
        }
    }
    .van-button--large{
        width:21rem;
        height:3.2rem;
        background:rgba(50,119,216,1);
        border-radius:0.4rem;
        margin: 2rem auto 2rem;
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
