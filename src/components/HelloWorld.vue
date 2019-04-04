<template>
  <div class="hello">
    <page-header
      :headerImg="headerImg"
      descriptionTitle="个人中心"
    ></page-header>
    <div class="cars-box" v-for="(item, index) in carsInfo" :key="item.index">
      <shadow-box>
        <div class="top">
          <li class="car"><img src="./../assets/img/car-green.png" alt=""></li>
          <li :class="['carnum', item.plate_number.length == 7 ? 'carNumBgBlue' : 'carNumBgBlueGreen']">
            <div>{{item.plate_number}}</div>
          </li>
          <li
            v-if="item.plate_number.length == 7"
            class="parking-number"
          >
            <div>{{item.parking}}</div>
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
            <p>{{item.carColor ? item.carColor : '--'}}</p>
          </li>
          <li>
            <span>车型信息:</span>
            <p>{{item.carBrand?item.carBrand:'--'}}</p>
          </li>
        </div>
        <div class="bottom">
          <li>
            <span>洗车次数:</span>
            <p>{{item.carTimes?item.carTimes:0}}</p>
          </li>
          <li>
            <span>服务到期时间:</span>
            <p>{{item.last_clear_time}}</p>
          </li>
          <van-button type="info" size="small" @click="renewalFee(index)">续费</van-button>
        </div>
      </shadow-box>
    </div>
    <!-- 添加车辆 -->
    <van-button
      type="info"
      size="large"
      @click="addCarInfo"
    >添加车辆</van-button>

    <!-- 停车签到弹出输入框 -->
    <van-dialog
      v-model="show"
      title="请输入您的车所在位置"
      show-cancel-button
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <textarea
        name="textarea"
        id="textarea"
        cols="30"
        rows="3"
        v-model="carAddressDr"
      ></textarea>
    </van-dialog>
  </div>
</template>

<script>
import url from '@/serviceAPI.config.js'
import mdFive from '@/md5.js'
import {Toast} from 'vant'
export default {
  name: 'HelloWorld',
  data () {
    return {
      headerImg:require('./../assets/img/car-red.png'),
      plate_number: '',         //车牌号
      parking:'',      //车位号
      carBrand:'',        //车型信息：
      carColor:'',        //车身颜色：
      carTimes:'',        //洗车次数：
      last_clear_time:'',         //服务到期时间
      carsInfo:[],
      access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
      carAddressDr:'',    //如果没有车位号，填写的车辆所在位置
      show:false,
    }
  },
  created(){
    let isError = this.$route.query.status
    // 如果请求返回 ERROR ，则主动请求授权
    if(isError == 'ERROR'){
      this.axios.post(url.getOauthRedirect,{
        access_token:this.access_token,
        redirect_uri:`http://www.ichevip.com/view/`,
        scope:'snsapi_userinfo'
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          window.location.href = res.data.data.oauth_url
        }
      }).catch(err => {
        console.log(err)
      })
    }else if(isError == 'SUCCESS'){
    // 静默授权模式
      this.axios.post(url.getOauthRedirect,{
        access_token:this.access_token,
        redirect_uri:`http://www.ichevip.com/view/`,
        scope:'snsapi_base'
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          window.location.href = res.data.data.oauth_url
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted(){
    if(!openid){
      localStorage.setItem('openid',this.$route.query.openid)
    }
    let openid = localStorage.getItem('openid')
    console.log(openid)

    // 获取车辆列表
    this.axios.post(url.getCarList,{
      access_token:this.access_token
    }).then(res => {
      this.carsInfo = res.data.data;
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    addCarInfo() {
      this.$router.push('/addCarInfo')
    },
    // 续费
    renewalFee(index){
      this.$router.push({
        path:'/pay',
        query:{
          id:this.carsInfo[index].id
        }
      })
    },
    // 停车签到
    checkIn(){
      this.show = true;
    },
    onConfirm(){
      this.show = false
      console.log(this.carAddressDr)
    },
    onCancel(){
      this.show = false;
      this.carAddressDr = ''
    },
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
  textarea{
    width: 21.667rem;
    height: 6.667rem;
    border: 1px solid rgba(50,119,216,1);
    display: block;
    margin: 10px auto;
    padding: .3rem;
    box-sizing: border-box;
  }
}
</style>
