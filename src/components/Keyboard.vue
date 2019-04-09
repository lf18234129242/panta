<template>
    <div>
        <!-- 输入车牌号码 -->
        <!-- <van-password-input
            :value="plate_number"
            :mask="false"
            length="8"
            @focus="showKeyboard = true"
        /> -->
        <div class="input-box">
            <input type="text" v-model="first">
            <input type="text" v-model="second">
            <input type="text" v-model="third">
            <input type="text" v-model="fourth">
            <input type="text" v-model="fifth">
            <input type="text" v-model="sixth">
            <input type="text" v-model="seventh">
            <input type="text" v-model="eighth">
        </div>
        <!-- 选择车牌号 首个汉字 弹出层 -->
        <div class="plate_number">
            <van-popup
                v-model="show_chinese"
                position="bottom"
                :overlay="true"
                overlay-class="displayNone"
            >
                <div class="plate_number_box">
                    <van-button
                        size="small"
                        v-for="(item, index) in ChineseList"
                        :key="item.id"
                        @click="checkChinese(index)"
                    >{{item.name}}</van-button>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showKeyboard: true,    //车牌号输入框是否聚焦
                show_chinese:true,     //是否显示汉字键盘
                ChineseList:[
                    {name:'冀',id:1},
                    {name:'豫',id:2},
                    {name:'云',id:3},
                    {name:'辽',id:4},
                    {name:'黑',id:5},
                    {name:'湘',id:6},
                    {name:'皖',id:7},
                    {name:'鲁',id:8},
                    {name:'新',id:9},
                    {name:'苏',id:10},
                    {name:'浙',id:11},
                    {name:'赣',id:12},
                    {name:'鄂',id:13},
                    {name:'桂',id:14},
                    {name:'甘',id:15},
                    {name:'晋',id:16},
                    {name:'蒙',id:17},
                    {name:'陕',id:18},
                    {name:'吉',id:19},
                    {name:'闽',id:20},
                    {name:'贵',id:21},
                    {name:'粤',id:22},
                    {name:'青',id:23},
                    {name:'藏',id:24},
                    {name:'川',id:25},
                    {name:'宁',id:26},
                    {name:'琼',id:27},
                ],
                plate_number: '',   //车牌号
                first:'',
                second:'',
                third:'',
                fourth:'',
                fifth:'',
                sixth:'',
                seventh:'',
                eighth:'',
            }
        },
        methods: {
            // 选择车牌号前面的汉字 
            checkChinese(index){
                console.log(this.ChineseList[index].name)
                this.first = this.ChineseList[index].name
            },
        },
    }
</script>

<style scoped lang="scss">
.input-box{
    width: 25rem;
    height: 3rem;
    display: flex;
    input{
        flex: 1;
        width: 3rem;
    }
}
.plate_number{
    .van-popup--bottom{
        background: #eee;
    }
    .plate_number_box{
        width: 100%;
        padding: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        .van-button--small{
            min-width: 4rem;
            height: 4rem;
        }
    }
}
</style>
<style lang="scss">
.displayNone{
    display: none!important;
}
</style>
