<template>
    <div class="AddCarInfo">
        <page-header
            :headerImg="headerImg"
            descriptionTitle="欢迎关注 盘他车辆管家"
        ></page-header>
        <div class="form">
            <van-field
                v-model="username"
                placeholder="请输入姓名（微信ID）"
                label="姓名"
                left-icon="contact"
            />
            <van-field
                v-model="carNum"
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
                v-model="parkingNum"
                :placeholder="parkingNumPlaceholder"
                label="车位号码"
                left-icon="flag-o"
                :disabled="parkingNumIsDisabled"
            />
            <van-field
                v-model="CommunityName"
                placeholder="请选择小区名称"
                label="小区名称"
                left-icon="hotel-o"
                @click.stop="show=true"
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
            @click="bindCarsNum"
        >绑定车牌号码</van-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                headerImg:require('./../assets/img/car-red.png'),
                username: '',
                carNum: '',
                parkingNum: '',
                CommunityName: '',
                isDisabled:true,
                parkingNumIsDisabled:false,
                parkingNumPlaceholder:'请输入车位号码',
                show:false,
                columns:['aaa','bbb','ccc','ddd']
            }
        },
        methods: {
            // 绑定车牌号
            bindCarsNum(){
                this.$router.push('/pay')
            },
            changeDisabledToTrue() {
                this.isDisabled = true;
                this.parkingNumIsDisabled = false;
                this.parkingNumPlaceholder = '请输入车位号码'
            },
            changeDisabledToFalse() {
                this.isDisabled = false;
                this.parkingNumIsDisabled = true;
                this.parkingNumPlaceholder = '无固定车位无需填写'
            },
            // 弹框 确认
            onConfirm(value) {
                this.show = false;
                this.CommunityName = value;
                // this.car_brand_pid = value.b_id;
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