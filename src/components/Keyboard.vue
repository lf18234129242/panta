<template>
    <div>
        <div class="input-box">
            <input type="text" maxlength="1" v-model="first" @focus="show_plate_number">
            <input type="text" maxlength="1" v-model="second" v-focus="numFocusArr[0]">
            <input type="text" maxlength="1" v-model="third" v-focus="numFocusArr[1]">
            <input type="text" maxlength="1" v-model="fourth" v-focus="numFocusArr[2]">
            <input type="text" maxlength="1" v-model="fifth" v-focus="numFocusArr[3]">
            <input type="text" maxlength="1" v-model="sixth" v-focus="numFocusArr[4]">
            <input type="text" maxlength="1" v-model="seventh" v-focus="numFocusArr[5]">
            <input type="text" maxlength="1" v-model="eighth" v-focus="numFocusArr[6]">
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
        <!-- 英文 数字 键盘 -->
        <div class="allBoard">
            <van-popup
                v-model="show_allBoard"
                position="bottom"
                :overlay="true"
                overlay-class="displayNone"
            >
                <div class="plate_number_box">
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
                ],
                English_Number:[
                    {id:28,name:'1'},
                    {id:29,name:'2'},
                    {id:30,name:'3'},
                    {id:31,name:'4'},
                    {id:32,name:'5'},
                    {id:33,name:'6'},
                    {id:34,name:'7'},
                    {id:35,name:'8'},
                    {id:36,name:'9'},
                    {id:37,name:'0'},
                    {id:38,name:'Q'},
                    {id:39,name:'W'},
                    {id:40,name:'E'},
                    {id:41,name:'R'},
                    {id:42,name:'T'},
                    {id:43,name:'Y'},
                    {id:44,name:'U'},
                    {id:45,name:'I'},
                    {id:46,name:'O'},
                    {id:47,name:'P'},
                    {id:48,name:'A'},
                    {id:49,name:'S'},
                    {id:50,name:'D'},
                    {id:51,name:'F'},
                    {id:52,name:'G'},
                    {id:53,name:'H'},
                    {id:54,name:'J'},
                    {id:55,name:'K'},
                    {id:56,name:'L'},
                    {id:57,name:'Z'},
                    {id:58,name:'X'},
                    {id:59,name:'C'},
                    {id:60,name:'V'},
                    {id:61,name:'B'},
                    {id:62,name:'N'},
                    {id:63,name:'M'},
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
                second_focus:false,
                third_focus:false,
                fourth_focus:false,
                fifth_focus:false,
                sixth_focus:false,
                seventh_focus:false,
                eighth_focus:false,
                numFocusArr:[false,false,false,false,false,false,false,]
            }
        },
        directives: {
            focus: {
                inserted: function (el, {value}) {
                    if (value) {
                        el.focus();
                    }
                }
            }
        },
        watch:{
            first(){
                console.log(this.first)
                // this.second_focus = true;
                this.numFocusArr[0] = true;

                this.show_chinese = false;
                this.show_allBoard = true;
            },
            second(){
                // this.second_focus = false;
                this.numFocusArr[0] = false;
                // this.third_focus = true;
                this.numFocusArr[1] = true;
                console.log(this.second)
            },
            third(){
                // this.third_focus = false;
                this.numFocusArr[1] = false;
                // this.fourth_focus = true;
                this.numFocusArr[2] = true;
                console.log(this.third)
            },
            fourth(){
                // this.fourth_focus = false;
                this.numFocusArr[2] = false;
                // this.fifth = true;
                this.numFocusArr[3] =true; 
                console.log(this.fourth)
            },
            fifth(){
                // this.fifth_focus = false;
                this.numFocusArr[3] = false;
                // this.sixth = true;
                this.numFocusArr[4] =true; 
                console.log(this.fifth)
            },
            sixth(){
                // this.sixth_focus = false;
                this.numFocusArr[4] = false;
                // this.seventh = true;
                this.numFocusArr[5] = true;
                console.log(this.sixth)
            },
            seventh(){
                // this.seventh_focus = false;
                this.numFocusArr[5] = false;
                // this.eighth = true;
                this.numFocusArr[6] = true;
                console.log(this.seventh)
            },
            eighth(){
                // this.eighth_focus = false;
                this.numFocusArr[6] = false;
                console.log(this.eighth)
            },
        },
        methods: {
            //第一个输入框聚焦，唤起汉字键盘
            show_plate_number(){
                this.show_chinese = true;
            },
            // 选择车牌号前面的汉字 
            checkChinese(index){
                this.first = this.ChineseList[index].name;

            },
            // 选择车牌号后面的数字和字母 
            checkEnglish_num(index){
                let numArr = ['','','','','','','',]
                // let numFocusArr = [this.second_focus,this.third_focus,this.fourth_focus,this.fifth_focus,this.sixth_focus,this.seventh_focus,this.eighth_focus]
                for (const i in this.numFocusArr) {
                    if(this.numFocusArr[i]=true){
                        console.log(this.numFocusArr)
                        console.log(this.numFocusArr[i] + i)
                        numArr[i] = (this.English_Number[index].name)
                        console.log(numArr)
                        
                        this.second = numArr[0]
                        console.log(this.second)
                        this.third = numArr[1]
                        this.fourth = numArr[2]
                        this.fifth = numArr[3]
                        this.sixth = numArr[4]
                        this.seventh = numArr[5]
                        this.eighth = numArr[6]
                    }   
                }
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
