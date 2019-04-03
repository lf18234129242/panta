<template>
  <div class="hello">
    <page-header
      :headerImg="headerImg"
      descriptionTitle="个人中心"
    ></page-header>
    <div class="cars-box" v-for="item in carsInfo" :key="item.index">
      <shadow-box>
        <div class="top">
          <li class="car"><img src="./../assets/img/car-green.png" alt=""></li>
          <li :class="['carnum', item.carNum.length == 7 ? 'carNumBgBlue' : 'carNumBgBlueGreen']">
            <div>{{item.carNum}}</div>
          </li>
          <li
            v-if="item.carNum.length == 7"
            class="parking-number"
          >
            <div>{{item.parkingNum}}</div>
          </li>
          <van-button
            v-else
            type="info"
            size="normal"
            @click="checkIn"
          >停车签到</van-button>
        </div> 
        <div class="bottom">
          <li>
            <span>车身颜色:</span>
            <p>{{item.carColor}}</p>
          </li>
          <li>
            <span>车型信息:</span>
            <p>{{item.carBrand}}</p>
          </li>
        </div>
        <div class="bottom">
          <li>
            <span>洗车次数:</span>
            <p>{{item.carTimes}}</p>
          </li>
          <li>
            <span>服务到期时间:</span>
            <p>{{item.endTime}}</p>
          </li>
          <van-button type="info" size="small" @click="renewalFee">续费</van-button>
        </div>
      </shadow-box>
    </div>
    <!-- 添加车辆 -->
    <van-button
      type="info"
      size="large"
      @click="addCarInfo"
    >添加车辆</van-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      headerImg:require('./../assets/img/car-red.png'),
      carNum: '',         //车牌号
      parkingNum:'',      //车位号
      carBrand:'',        //车型信息：
      carColor:'',        //车身颜色：
      carTimes:'',        //洗车次数：
      endTime:'',         //服务到期时间
      carsInfo:[
        {
          carNum: '沪A12345',
          parkingNum:'A12', 
          carBrand:'本田', 
          carColor:'绿色', 
          carTimes:'20', 
          endTime:'2019.6.6', 
        },
        {
          carNum: '沪A123456',
          parkingNum:'A12', 
          carBrand:'奔驰', 
          carColor:'绿色', 
          carTimes:'2', 
          endTime:'2019.6.6', 
        },
      ]
    }
  },
  mounted(){
    // console.log('沪A123456'.length)
  },
  methods: {
    addCarInfo() {
      this.$router.push('/addCarInfo')
    },
    // 续费
    renewalFee(){

    },
    // 停车签到
    checkIn(){},
  },
}
</script>

<style scoped lang="scss">
.hello{
  width: 100%;
  position: absolute;
  .top{
    width: 100%;
    height: 4.267rem;
    padding-bottom: 1.067rem;
    border-bottom: 1px solid #979797;
    display: flex;
    align-items: center;
    .van-button--info{
      background: #FCDF14;
      border-radius:.4rem;
      width:6.4rem;
      height:2.533rem;
      border-color: #FCDF14;
      font-size: 1.067rem;
      line-height: 0;
      padding: 0 5px;
    }
    .car{
      width: 4.267rem;
      height: 4.267rem;
      border-radius: 50%;
      border: 1px solid #3277D8;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: .6rem;
      img{
        width: 70%;
      }
    }
    .carnum{
      width: 8.933rem;
      height: 2.467rem;
      color: #fff;
      text-align: center;
      margin-right: .333rem;
      border-radius:2px;
      display: flex;
      align-items: center;
      justify-content: center;
      div{
        border: 1px solid #fff;
        border-radius: 2px;
        width:8.167rem;
        height:2.2rem;
        line-height: 2.2rem;
        box-sizing: border-box;
      }
    }
    .carNumBgBlue{
      background: #3277D8;
      opacity: 0.8;
    }
    .carNumBgBlueGreen{
      background: #55C15B;
      opacity: 0.8;
    }
    .parking-number{
      width: 6.4rem;
      height: 2.467rem;
      background:rgba(252,223,20,1);
      opacity: 0.8;
      border-radius:.4rem;
      color: #fff;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      div{
        width:5.633rem;
        height:2.2rem;
        line-height: 2.2rem;
        border-radius:.4rem;
        border:1px solid rgba(255,255,255,1);
      }
    }
  }
  .bottom{
    width: 100%;
    padding: 1rem 0;
    border-bottom: 1px solid #979797;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    li{
      margin-right: 2.267rem;
      span{
        color: #606470;
        font-size: 12px;
      }
      p{
        color: #323643;
        font-size: 14px;
        height: 1.333rem;
        line-height: 1.333rem;
        margin-top: .267rem;
      }
    }
    .van-button--small{
      width:3.867rem;
      height:2rem;
      background:rgba(50,119,216,1);
      border-radius:.4rem;
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
