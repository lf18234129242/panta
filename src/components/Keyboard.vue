<template>
    <div class="keyboard">
        <div class="input-box">
            <li @click="firstClick">{{first}}</li>
            <li @click="secondClick">{{numArr[0]}}</li>
            <li @click="secondClick">{{numArr[1]}}</li>
            <li @click="secondClick">{{numArr[2]}}</li>
            <li @click="secondClick">{{numArr[3]}}</li>
            <li @click="secondClick">{{numArr[4]}}</li>
            <li @click="secondClick">{{numArr[5]}}</li>
            <li @click="secondClick">{{numArr[6]}}</li>
        </div>
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
                show_chinese:false,     //是否显示汉字键盘
                show_allBoard:false,     //是否显示英文数字键盘
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
                    {name:'删除',id:99},
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
                    {name:'删除',id:99},
                ],
                plate_number: '',   //车牌号
                first:'',
                numArr:[],
            }
        },
        methods: {
            //第一个输入框聚焦，唤起汉字键盘，隐藏字母数字键盘
            firstClick(){
                this.show_chinese = true;
                this.show_allBoard = false;
            },
            //第二个之后的输入框聚焦，唤起字母数字键盘，隐藏汉字键盘
            secondClick(){
                this.show_chinese = false;
                this.show_allBoard = true;
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
                    if(this.numArr.length > 7){
                        this.numArr.pop()
                    }
                }
            },
        },
    }
</script>

<style scoped lang="scss">
.keyboard{
    width: 100%;
    position: absolute;
}
.input-box{
    width: 20rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    li{
        flex: 1;
        border: 1px solid #999;
        box-sizing: border-box;
        margin-left: -1px;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    li:nth-child(1){
        margin-left: 0;
    }
}
.plate_number{
    .van-popup--bottom{
        background: #eee;
    }
    .plate_chinese_box{
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
        background: #aaa;
        .van-button--small{
            width: 14.2%;
            height: 4rem;
            min-width: 0;
        }
    }
}
.allBoard{
    .plate_number_box{
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
        background: #aaa;
        .van-button--small{
            width: 10%;
            height: 3rem;
            min-width: 0;
        }
        .van-button--small:nth-child(1){
            margin-bottom: 5px;
        }
        .van-button--small:nth-child(21){
            margin-left: 5%;
        }
        .van-button--small:nth-child(30){
            margin-left: 5%;
        }
        .van-button--small:last-child{
            width: 20%;
        }
    }
}
</style>
<style lang="scss">
.displayNone{
    display: none!important;
}
</style>