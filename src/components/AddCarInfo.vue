<template>
    <div class="AddCarInfo">
        <page-header
            :headerImg="headerImg"
            descriptionTitle="欢迎关注 盘他车辆管家"
        ></page-header>
        <div class="form">
            <van-field
                v-model="car_owner"
                placeholder="请输入姓名（微信ID）"
                label="姓名"
                left-icon="contact"
                @focus="hideKeyboard"
                @blur="onBlur"
            />
            <!-- 普通车牌号  新能源车牌号 -->
            <div class="two-button">
                <li 
                    :class="[isDisabled_plant ? 'blueBg' : 'whiteBg']"
                    @click.stop="changeYesToTrue" 
                >普通车牌号</li>
                <li 
                    :class="[!isDisabled_plant ? 'blueBg' : 'whiteBg']"
                    @click.stop="changeNoToFalse" 
                >新能源车牌号</li>
            </div>
            <div class="input-box" @click="clickShowKeyboard" v-show="showKeyBoard">
                <li>{{first}}</li>
                <li v-for="(item,index) in 6" :key="item">{{numArr[index]}}</li>
            </div>
            <div class="input-box" @click="clickShowKeyboard" v-show="!showKeyBoard">
                <li>{{first}}</li>
                <li v-for="(item,index) in 7" :key="item">{{numArr[index]}}</li>
            </div>
            <!-- 是否为固定车位 -->
            <div class="two-button">
                <li 
                    :class="[isDisabled ? 'blueBg' : 'whiteBg']"
                    @click.stop="changeDisabledToTrue" 
                >固定车位</li>
                <li 
                    :class="[!isDisabled ? 'blueBg' : 'whiteBg']"
                    @click.stop="changeDisabledToFalse" 
                >非固定车位</li>
            </div>
            <van-field
                v-model="parking"
                :placeholder="parkingPlaceholder"
                label="车位号码"
                left-icon="flag-o"
                :disabled="parkingIsDisabled"
                @keyup="parking=parking.replace(/[^\w\.\/]/ig,'')"
                @focus="hideKeyboard"
                @blur="onBlur"
            />
            <van-field
                v-model="village_name"
                placeholder="请选择小区名称"
                label="小区名称"
                left-icon="hotel-o"
                @click="checkVillage"
                @focus="hideKeyboard"
            />
            <!-- 选择小区名称弹出层 -->
            <van-popup v-model="show" position="bottom" :overlay="true">
                <van-picker
                    show-toolbar
                    title="请选择小区名称"
                    :columns="columns"
                    value-key="name"
                    @confirm="onConfirm"
                    @cancel="onCancel"
                    @change="onChange"
                />
            </van-popup>
        </div>
        <!-- 免责声明 -->
        <div class="statement">
            <van-checkbox v-model="checked">已阅读并同意</van-checkbox>
            <span class="span-link" @click="statement">免责声明</span>
            <span class="span">中的条款</span>
        </div>
        <div class="dialog-box">
            <van-dialog
                v-model="show_statement"
                title="免责声明"
                confirm-button-text="同意"
                cancel-button-text="拒绝"
                show-cancel-button
                @confirm="onConfirm_statement"
                @cancel="onCancel_statement"
            >
                {{dialog_content}}
            </van-dialog>
        </div>
        <!-- 绑定车辆 -->
        <van-button
            type="info"
            size="large"
            :disabled="disabledBindCarInfo"
            @click="submitAddCarInfo"
        >绑定车牌号码</van-button>


<!-- 虚拟键盘弹出层 -->
        <!-- 选择车牌号 首个汉字键盘 弹出层 -->
        <div class="plate_number">
            <van-popup
                v-model="show_chinese"
                position="bottom"
                :overlay="true"
                overlay-class="displayNone"
            >
                <div class="plate_chinese_box">
                    <!-- 点击对应的汉字，进行输入 -->
                    <van-button
                        size="small"
                        v-for="(item, index) in ChineseList" 
                        :key="item.id"
                        @click="checkChinese(index)"
                    >{{item.name}}</van-button>
                    <div class="close-box" @click.stop="close_keyboard">
                        <div>
                            <van-icon name="close" />
                        </div>
                        <li></li>
                    </div>
                </div>
            </van-popup>
        </div>
        <!-- 英文 数字 键盘 -->
        <div class="allBoard">
            <van-popup
                v-model="show_allBoard"
                position="bottom"
                :overlay="true"
                overlay-class="displayNone"
            >
                <div class="plate_number_box">
                    <!-- 点击对应的字母或数字，进行输入 -->
                    <van-button
                        size="small"
                        v-for="(item, index) in English_Number"
                        :key="item.id"
                        @click="checkEnglish_num(index)"
                    >{{item.name}}</van-button>
                    <div class="close-box" @click.stop="close_keyboard">
                        <div>
                            <van-icon name="close" />
                        </div>
                        <li></li>
                    </div>
                </div>
            </van-popup>
        </div>
        <div class="loading-box" v-if="isShowLoading">
            <van-loading/>
        </div>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
var village_list = []
var villagee_ieku_json = {}
    export default {
        data() {
            return {
                columns:[
                    {
                        values: village_list,
                        className: 'column1'
                    },
                    {
                        values: villagee_ieku_json['北京星河湾'],
                        className: 'column2',
                    }
                ],
                checked:true,   //免责声明
                show_statement:true,
                dialog_content:'',
                disc_id:0,
                disabledBindCarInfo:false,      //绑定按钮是否禁用
                headerImg:require('./../assets/img/car-red.png'),
                car_owner:localStorage.getItem('username'),
                plate_number: '',   //车牌号
                plate_type:1,   //车牌种类，1-普通 2-新能源；默认 1
                fixed:1,       //1-固定车位，2-非固定车位；默认 1
                parking: '',    //车位号（默认必填），当fixed=1 时为必填
                village_id: '',    //车辆所在的合作社区id
                garage_id:'',       //车辆所在的合作社区的车库id
                village_name: '',   //小区名称
                isDisabled:true,    //是否为固定车位
                isDisabled_plant:true,  //是否为普通车牌号
                showKeyBoard:true,      //显示普通车牌号 或者 新能源车牌号
                parkingIsDisabled:false,
                parkingPlaceholder:'请输入车位号码',
                show:false,
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
                // 虚拟键盘专用
                clickS: true,    //车牌号输入框是否聚焦(){},
                show_chinese:false,     //是否显示汉字键盘
                show_allBoard:false,     //是否显示英文数字键盘
                ChineseList:[
                    {name:'京',id:1},
                    {name:'津',id:2},
                    {name:'冀',id:3},
                    {name:'晋',id:4},
                    {name:'蒙',id:5},
                    {name:'辽',id:6},
                    {name:'吉',id:7},
                    {name:'黑',id:8},
                    {name:'沪',id:9},
                    {name:'苏',id:10},
                    {name:'浙',id:11},
                    {name:'皖',id:12},
                    {name:'闽',id:13},
                    {name:'赣',id:14},
                    {name:'鲁',id:15},
                    {name:'豫',id:16},
                    {name:'鄂',id:17},
                    {name:'湘',id:18},
                    {name:'粤',id:19},
                    {name:'桂',id:20},
                    {name:'琼',id:21},
                    {name:'渝',id:22},
                    {name:'川',id:23},
                    {name:'贵',id:24},
                    {name:'云',id:25},
                    {name:'藏',id:26},
                    {name:'陕',id:27},
                    {name:'甘',id:28},
                    {name:'青',id:29},
                    {name:'宁',id:30},
                    {name:'新',id:31},
                    {name:'←',id:99},
                ],
                English_Number:[
                    {name:'1',id:28},
                    {name:'2',id:29},
                    {name:'3',id:30},
                    {name:'4',id:31},
                    {name:'5',id:32},
                    {name:'6',id:33},
                    {name:'7',id:34},
                    {name:'8',id:35},
                    {name:'9',id:36},
                    {name:'0',id:37},
                    {name:'Q',id:38},
                    {name:'W',id:39},
                    {name:'E',id:40},
                    {name:'R',id:41},
                    {name:'T',id:42},
                    {name:'Y',id:43},
                    {name:'U',id:44},
                    {name:'I',id:45},
                    {name:'O',id:46},
                    {name:'P',id:47},
                    {name:'A',id:48},
                    {name:'S',id:49},
                    {name:'D',id:50},
                    {name:'F',id:51},
                    {name:'G',id:52},
                    {name:'H',id:53},
                    {name:'J',id:54},
                    {name:'K',id:55},
                    {name:'L',id:56},
                    {name:'Z',id:57},
                    {name:'X',id:58},
                    {name:'C',id:59},
                    {name:'V',id:60},
                    {name:'B',id:61},
                    {name:'N',id:62},
                    {name:'M',id:63},
                    {name:'←',id:99},
                ],
                first:'',           //车牌号首位汉字
                numArr:[],          //车牌号
                isShowLoading:true,
                openid:'',
            }
        },
        created(){

            let openid = localStorage.getItem('openid')
            this.openid = openid;
            if(openid && openid !== 'undefined'){
                //如果有 openid ，获取用户 姓名，手机号
                this.isShowLoading = false;
                this.getClientInfo()
                return;
            }else{
                localStorage.setItem('openid',this.$route.query.openid)
                let openid = localStorage.getItem('openid')
                if(openid && openid !== 'undefined'){
                    //如果有 openid ，获取用户 姓名，手机号
                    this.isShowLoading = false;
                    this.getClientInfo()
                }else{
                    // 授权第一步
                    this.getSelfInfo()
                }
            } 
        },
        watch:{
            checked(){
                if(this.checked == true){
                    this.disc_id = 1;
                    this.disabledBindCarInfo = false;
                }else if (this.checked == false){
                    this.disc_id = 0;
                    this.disabledBindCarInfo = true;
                }
            },
            openid(){
                if(this.openid && this.openid !== undefined &&village_list){
                    this.getVillageList();
                }
            },
        },
        mounted(){
            // 获取免责声明
            this.axios.post(url.getDisclaimer,{
                access_token:this.access_token,
                type:1
            }).then(res => {
                console.log(res)
                if(res.data.code == 0){
                    this.dialog_content = res.data.data.content;
                    this.disc_id = res.data.data.disc_id;
                }
            }).catch(err => {
                console.log(err)
                Toast(`获取免责声明失败，请您稍后再试！`)
            })

            // this.getVillageList();
        },
        destroyed(){
            village_list = [];
            villagee_ieku_json = {}
        },
        methods: {
            // 获取小区列表
            getVillageList(){
                this.axios.post(url.getVillageList,{
                    access_token:this.access_token
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        // 将后台传过来的 json 数组里面的 name 换成 text
                        let columns_list;
                        columns_list = JSON.parse(JSON.stringify(res.data.data.data).replace(/r_name/g,'name'))
                        columns_list = JSON.parse(JSON.stringify(columns_list).replace(/title/g,'name'))
                        
                        for(let i=0;i<columns_list.length;i++){
                            village_list.push(columns_list[i])
                            villagee_ieku_json[village_list[i].name] = village_list[i].garage
                        }
                    }else if(res.data.code == 1020009){
                        this.getSelfInfo()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 免责声明
            statement(){
                this.show_statement = true;
            },
            onConfirm_statement(){
                this.show_statement = false;
                this.checked = true;
                this.disc_id = 1;
            },
            onCancel_statement(){
                this.show_statement = false;
                this.checked = false;
                this.disc_id = 0;
            },
            // 当其他input 聚焦的时候，收起虚拟键盘
            hideKeyboard(){
                this.show_chinese = false;
                this.show_allBoard = false;
            },
            //获取用户 姓名、手机号
            getClientInfo(){
                let openid = localStorage.getItem('openid')
                this.axios.post(url.getClientInfo,{
                    access_token:this.access_token,
                    openid:openid
                }).then(res => {
                    console.log(res)
                    this.car_owner = res.data.data.username
                    localStorage.setItem('id',res.data.data.id)
                    localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
                    localStorage.setItem('username',res.data.data.username)
                }).catch(err => {
                    console.log(err)
                })
            },
            //  getSelfInfo   授权第一步
            getSelfInfo(){
                this.axios.post(url.getSelfInfo,{
                    access_token:this.access_token
                }).then(res=> {
                    // 如果用户未登录   跳转到后台返回的链接
                    if(res.data.code == 1020009){
                        let isError = this.$route.query.status
                        this.snsapi_userinfo()
                        return false;
                    // 静默授权，获取微信名 头像 openid id
                    }else if(res.data.code == 0){
                        this.isShowLoading = false;
                        this.car_owner = res.data.data.username
                        localStorage.setItem('openid',res.data.data.openid)
                        localStorage.setItem('id',res.data.data.id)
                        localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
                        localStorage.setItem('username',res.data.data.username)
                        this.getVillageList();
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 静默授权模式
            snsapi_base(){
                this.axios.post(url.getOauthRedirect,{
                    access_token:this.access_token,
                    redirect_uri:`http://www.ichevip.com/view/addCarInfo`,
                    scope:'snsapi_base'
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        window.location.href = res.data.data.oauth_url
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 非静默授权模式
            snsapi_userinfo(){
                this.axios.post(url.getOauthRedirect,{
                    access_token:this.access_token,
                    redirect_uri:`http://www.ichevip.com/view/addCarInfo`,
                    scope:'snsapi_userinfo'
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 0){
                        window.location.href = res.data.data.oauth_url
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 绑定车牌号
            submitAddCarInfo(){
                // let rule = /^\w+$/;
                this.plate_number = this.first + this.numArr.join('')
                if(this.plate_number.length < 7 || this.plate_number.length > 8){
                    Toast(`请输入正确的车牌号码！`)
                    return false;
                }else if(this.fixed == 1 && !this.parking){
                    Toast(`如果您有固定车位，请输入车位号码`)
                    return false;
                }else if(this.village_name == ''){
                    Toast(`请输入所在的小区名称！`)
                    return false;
                }else{
                    this.axios.post(url.addCarInfo,{
                        access_token:this.access_token,
                        car_owner:this.car_owner,
                        plate_number:this.plate_number,
                        fixed:this.fixed,
                        parking:this.parking,
                        village_id:this.village_id,
                        garage_id:this.garage_id,
                        plate_type:this.plate_number.length < 8 ? 1 : 2,
                        disc_id:this.disc_id
                    }).then(res => {
                        console.log(res)
                        if(res.data.code == 0){
                            Toast(`车辆信息添加成功！`)
                            this.$router.push({
                                path:'/pay',
                                query:{
                                    car_id:res.data.data.car_id
                                }
                            })
                        }else{
                            Toast(`绑定失败，请核对信息再重试！`)
                        }
                    }).catch(err => {
                        Toast(`绑定失败，请核对信息再重试！${err}`)
                    })
                }
            },
            changeDisabledToTrue() {
                this.fixed = 1;
                this.isDisabled = true;
                this.parkingIsDisabled = false;
                this.parkingPlaceholder = '请输入车位号码'
            },
            changeDisabledToFalse() {
                // this.fixed = 2;
                // this.isDisabled = false;
                // this.parkingIsDisabled = true;
                // this.parkingPlaceholder = '无固定车位无需填写'
                // this.parking = ''
            },
            changeYesToTrue(){
                this.isDisabled_plant = true;
                this.showKeyBoard = true;
                if(this.numArr.length > 6){
                    this.numArr.pop()
                }
            },
            changeNoToFalse(){
                this.isDisabled_plant = false;
                this.showKeyBoard = false;
            },
            // 选择小区
            onBlur(){
                document.body.scrollTop = document.body.scrollTop;
            },
            checkVillage(){
                document.body.scrollTop = document.body.scrollTop;
                this.show = true;
                document.activeElement.blur();
            },
            onChange(picker, values) {
                picker.setColumnValues(1, villagee_ieku_json[values[0].name]);
            },
            //选择小区 弹框 确认
            onConfirm(value) {
                this.show = false;
                if(value[1] == undefined){
                    this.village_name = value[0].name
                    this.village_id = value[0].id;
                    this.garage_id = '';
                }else{
                    this.village_name = value[0].name + ',' + value[1].name;
                    this.village_id = value[0].id;
                    this.garage_id = value[1].id;
                }
            },
            // 弹框 取消
            onCancel() {
                this.show = false;
            },

            // 唤起键盘
            clickShowKeyboard(){
                if(!this.first){
                    this.show_chinese = true;
                }else{
                    this.show_chinese = false;
                    this.show_allBoard = true;
                }
            },
            // 选择车牌号前面的汉字 
            checkChinese(index){
                // 如果点击删除键，删除第一个格的内容
                if(this.ChineseList[index].id == 99){
                    this.first = ''
                }else{
                    // 把选中的字赋值给第一个格，并且切换键盘
                    this.first = this.ChineseList[index].name;
                    this.show_chinese = false;
                    this.show_allBoard = true;
                }
            },
            // 选择车牌号后面的数字和字母 
            checkEnglish_num(index){
                // 如果点击删除键，删除 numArr 的最后一个值
                if(this.English_Number[index].id == 99){
                    this.numArr.pop()
                    // 如果 numArr 里面被删的没有值了，切换键盘
                    if(this.numArr.length == 0){
                        this.show_chinese = true;
                        this.show_allBoard = false;
                    }
                }else{
                    // 把选中的值 push 到 numArr 内
                    this.numArr.push(this.English_Number[index].name)
                    // 如果 numArr 中的值超过 7 个（车牌号的最大位数），删除最后一个
                    if(this.showKeyBoard){
                        if(this.numArr.length > 6){
                            this.numArr.pop()
                        }
                    }else{
                        if(this.numArr.length > 7){
                            this.numArr.pop()
                        }
                    }
                }
            },
            // 关闭虚拟键盘
            close_keyboard(){
                this.show_chinese = false;
                this.show_allBoard = false;
            }
        },
    }
</script>

<style scoped lang="scss">
.AddCarInfo{
    width: 100%;
    position: absolute;
    .form{
        .van-cell{
            width:21rem;
            height:3.2rem;
            background:rgba(255,255,255,1);
            box-shadow:0px 6px 8px 0px rgba(96,100,112,0.1);
            border-radius:.4rem;
            border:1px solid rgba(206,208,210,1);
            margin: 0 auto 2rem;
        }
        .van-field__left-icon {
            margin-right: 10px;
        }
        .two-button{
            width:21rem;
            height:3.2rem;
            border-radius:.667rem;
            border:2px solid rgba(16,142,233,1);
            margin: 0 auto 2rem;
            box-sizing: border-box;
            display: flex;
            li{
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            li:nth-child(1){
                border-radius: .4rem 0 0 .4rem;
            }
            li:nth-child(2){
                border-radius: 0 .4rem .4rem 0;
            }
            .blueBg{
                background: rgba(16,142,233,1);
                color: #fff;
            }
            .whiteBg{
                background: #fff;
                color: #108EE9;
            }
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
// 车牌号 & 虚拟键盘
.input-box{
    width: 21rem;
    height:3.2rem;
    margin: auto;
    background:rgba(255,255,255,1);
    box-shadow:0px 6px 8px 0px rgba(96,100,112,0.1);
    border-radius:.4rem;
    border:1px solid rgba(206,208,210,1);
    margin: 0 auto 2rem;
    display: flex;
    justify-content: center;
    li{
        flex: 1;
        border-right:1px solid rgba(206,208,210,1);
        box-sizing: border-box;
        margin-left: -1px;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #323233;
    }
    li:last-child{
        border: none;
    }
}
.class-close-box{
    width: 2rem;
    height: 1.5rem;
    position: absolute;
    right: 0.5rem;
    top: -1.3rem;
}
.class-close-box-div{
    width: 1rem;
    height: 1rem;
    margin: auto;
    text-align: center;
}
.class-close-box-li{
    width: 1px;
    height: 0.5rem;
    background: #666;
    margin: auto;
}
.overflow-y{
    overflow-y: inherit;
}
.class-van-button-small{
    min-width: 0;
    border-radius: 5px;
    margin: 5px 2px;
    box-shadow: 5px 5px 5px #aaa;
}
.class-plate-box{
    width: 100%;
    padding: 0.7rem 0.5rem;
    box-sizing: border-box;
    background: #eaf1f9;
    position: relative;
}
.plate_number{
    .van-popup{
        @extend .overflow-y;
    }
    .van-popup--bottom{
        background: #eee;
    }
    .plate_chinese_box{
        width: 100%;
        @extend .class-plate-box;
        .close-box{
            @extend .class-close-box;
            div{
                @extend .class-close-box-div;
            }
            li{
                @extend .class-close-box-li;
            }
        }
        .van-button--small{
            width: 11.3%;
            height: 3.5rem;
            @extend .class-van-button-small;
        }
    }
}
.allBoard{
    .van-popup{
        @extend .overflow-y;
    }
    .plate_number_box{
        width: 100%;
        @extend .class-plate-box;
        .close-box{
            @extend .class-close-box;
            div{
                @extend .class-close-box-div;
            }
            li{
                @extend .class-close-box-li;
            }
        }
        .van-button--small{
            width: 8.8%;
            height: 3rem;
            @extend .class-van-button-small;
        }
        .van-button--small:nth-child(1){
            margin-bottom: 5px;
        }
        .van-button--small:nth-child(21){
            margin-left: 5%;
        }
        .van-button--small:nth-child(30){
            margin-left: 10%;
        }
        .van-button--small:last-child{
            width: 13%;
        }
    }
}
</style>
<style lang="scss">
.displayNone{
    display: none!important;
}
.font-12{
    font-size: 12px;
    line-height: 15px;
}
// 免责声明
.statement{
    width: 100%;
    height: .667rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.8rem;
    .van-checkbox__label{
        @extend .font-12;
    }
    .span-link{
        color: #3232E0;
        @extend .font-12;
    }
    .span{
        @extend .font-12;
    }
    .van-checkbox__icon .van-icon{
        width: 15px;
        height: 15px;
        line-height: 15px;
    }
    .van-checkbox__icon, .van-checkbox__label{
        line-height: 26px;
    }
}
.dialog-box{
    .van-dialog__content{
        padding: 20px;
        box-sizing: border-box;
    }
    .van-dialog__cancel, .van-dialog__cancel:active{
        color: #f00;
    }
}
</style>