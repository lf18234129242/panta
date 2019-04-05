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
            />
            <van-field
                v-model="plate_number"
                placeholder="请输入车牌号码"
                label="车牌号码"
                class-prefix="my-icon"
                left-icon="coupon-o"
            />
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
            />
            <van-field
                v-model="village_name"
                placeholder="请选择小区名称"
                label="小区名称"
                left-icon="hotel-o"
                @click.stop="checkVillage"
            />
            <!-- 弹出层 -->
            <van-popup v-model="show" position="bottom" :overlay="true">
                <van-picker
                    show-toolbar
                    title="请选择小区名称"
                    :columns="columns"
                    @confirm="onConfirm"
                    @cancel="onCancel"
                />
            </van-popup>
        </div>
        <van-button
            type="info"
            size="large"
            @click="addCarInfo"
        >绑定车牌号码</van-button>
    </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
    export default {
        data() {
            return {
                headerImg:require('./../assets/img/car-red.jpg'),
                car_owner: localStorage.getItem('username'),
                plate_number: '',   //车牌号
                plate_type:1,   //车牌种类，1-普通 2-新能源；默认 1
                fixed:1,       //1-固定车位，2-非固定车位；默认 1
                parking: '',    //车位号（默认必填），当fixed=1 时为必填
                village_id: '',    //车辆所在的合作社区id
                village_name: '',   //小区名称
                isDisabled:true,
                parkingIsDisabled:false,
                parkingPlaceholder:'请输入车位号码',
                show:false,
                columns:[],
                access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
            }
        },
        mounted(){
            this.axios.post(url.getVillageList,{
                access_token:this.access_token
            }).then(res => {
                if(res.data.code == 0){
                    // 将后台传过来的 json 数组里面的 name 换成 text
                    this.columns = JSON.parse(JSON.stringify(res.data.data.data).replace(/r_name/g,'text'))
                }
            }).catch(err => {
                console.log(err)
            })
        },
        methods: {
            // 绑定车牌号
            addCarInfo(){
                if(this.plate_number.length < 7 && this.plate_number.length > 8){
                    Toast(`请输入正确的车牌号码！`)
                    return false;
                }else if(this.fixed == 1){
                    if(!this.parking){
                        Toast(`如果您有固定车位，请输入车位号码`)
                        return false;
                    }
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
                        plate_type:this.plate_number.length < 8 ? 1 : 2
                    }).then(res => {
                        if(res.data.code == 0){
                            this.$router.push({path:'/pay',query:{car_id:res.data.car_id}})
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
                this.fixed = 2;
                this.isDisabled = false;
                this.parkingIsDisabled = true;
                this.parkingPlaceholder = '无固定车位无需填写'
            },
            // 选择小区
            checkVillage(){
                this.show = true;
                document.activeElement.blur();
            },
            // 弹框 确认
            onConfirm(value) {
                this.show = false;
                this.village_name = value.text;
                this.village_id = value.id;
            },
            // 弹框 取消
            onCancel() {
                this.show = false;
            },
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
</style>