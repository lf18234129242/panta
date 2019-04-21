<template>
  <div class="hello">
    <page-header
      :headerImg="headerImg"
      descriptionTitle="个人中心"
    ></page-header>
    <div
      class="cars-box"
      v-for="(item, index) in carsInfo"
      :key="item.index"
      @click="to_washer_record(index)"
    >
      <shadow-box>
        <div class="top">
          <li class="car"><img src="./../assets/img/car-green.png" alt=""></li>
          <li :class="['carnum', item.plate_number.length == 8 ? 'carNumBgBlueGreen' : 'carNumBgBlue']">
            <div>{{item.plate_number}}</div>
          </li>
          <van-button
            v-if="item.fixed == 2"
            type="info"
            size="normal"
            @click.stop="checkIn(index)"
          >停车签到</van-button>
          <li
            v-else
            class="parking-number"
          >
            <div>{{item.parking}}</div>
          </li>
        </div> 
        <div class="bottom">
          <li>
            <span>车身颜色:</span>
            <p>{{item.carColor ? item.carColor : '--'}}</p>
          </li>
          <li>
            <span>车型信息:</span>
            <p>{{item.car_brand + item.car_model?item.car_brand + item.car_model:'--'}}</p>
          </li>
        </div>
        <div class="bottom">
          <li>
            <span>洗车次数:</span>
            <p>{{item.clear_times?item.clear_times:0}}</p>
          </li>
          <li>
            <span>服务到期时间:</span>
            <p>{{item.over_time}}</p>
          </li>
          <van-button type="info" size="small" @click.stop="renewalFee(index)">续费</van-button>
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

    <div class="loading-box" v-if="isShowLoading">
        <van-loading/>
    </div>
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
      parking:'',      //item.car_brand + 车位号
      car_model:'',        //车型信息：
      carColor:'',        //车身颜色：
      clear_times:'',        //洗车次数：
      over_time:'',         //服务到期时间
      carsInfo:[],
      access_token : this.$md5(mdFive.prefix_str + mdFive.access_date + mdFive.api_key),
      carAddressDr:'',    //如果没有车位号，填写的车辆所在位置
      show:false,
      id:'',    //车辆 id
      isShowLoading:true,
    }
  },
  created(){
    let openid = localStorage.getItem('openid')
    if(openid && openid !== 'undefined'){
      console.log(102)
      //如果有 openid ，获取用户 姓名，手机号
      this.isShowLoading = false;
      this.getClientInfo()
    }else{
      console.log(106)
      localStorage.setItem('openid',this.$route.query.openid)
      let openid = localStorage.getItem('openid')
      if(openid && openid !== 'undefined'){
      this.isShowLoading = false;
      console.log(110)
        //如果有 openid ，获取用户 姓名，手机号
        this.getClientInfo()
      }else{
      console.log(114)
        // 授权第一步
        this.getSelfInfo()
      }
    } 
  },
  mounted(){
    // 获取车辆列表
    this.axios.post(url.getCarList,{
      access_token:this.access_token
    }).then(res => {
      console.log(res)
      if(res.data.code == 0){
        this.carsInfo = res.data.data;
      }else if(res.data.code == 1020009){
        this.getSelfInfo()
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    //跳转到洗车记录页
    to_washer_record(index){
      this.$router.push({
        path:'/washer-record',
        query:{
          car_id:this.carsInfo[index].cid
        }
      })
    },
    //获取用户 姓名、手机号
    getClientInfo(){
        let openid = localStorage.getItem('openid')
        if(!localStorage.getItem('username')){
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
        }
    },
    //  getSelfInfo   授权第一步
    getSelfInfo(){
        this.axios.post(url.getSelfInfo,{
            access_token:this.access_token
        }).then(res=> {
            console.log(res)
            // 如果用户未登录   跳转到后台返回的链接
            if(res.data.code == 1020009){
                let isError = this.$route.query.status
                // 如果 url 里面没有 isError 参数，就跳转请求连接
                if(isError==undefined || !isError){
                    window.location.href = res.data.data.oauth_url;
                    // 如果请求返回 ERROR ，则主动请求授权
                }else if(isError == 'ERROR'){
                    // 非静默授权模式
                    this.snsapi_userinfo()
                }else if(isError == 'SUCCESS'){
                    // 静默授权模式
                    this.snsapi_base()
                }
                return false;
            // 静默授权，获取微信名 头像 openid id
            }else if(res.data.code == 0){
                this.isShowLoading = false;
                this.car_owner = res.data.data.username
                localStorage.setItem('openid',res.data.data.openid)
                localStorage.setItem('id',res.data.data.id)
                localStorage.setItem('wx_headimgurl',res.data.data.wx_headimgurl)
                localStorage.setItem('username',res.data.data.username)
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
    addCarInfo() {
      this.$router.push('/addCarInfo')
    },
    // 续费
    renewalFee(index){
      this.$router.push({
        path:'./pay',
        query:{
          car_id:this.carsInfo[index].cid
        }
      })
    },
    // 停车签到
    checkIn(index){
      this.show = true;
      this.id = this.carsInfo[index].cid
    },
    // 提交停车签到信息
    onConfirm(){
      if(!this.carAddressDr){
        Toast('请描述您的车辆所在位置！')
      }else{
        this.show = false
        this.axios.post(url.parkingSign,{
          access_token:this.access_token,
          id:this.id,
          parking:this.carAddressDr
        }).then(res => {
          console.log(res)
          Toast(`提交成功！`)
        }).catch(err => {
          console.log(err)
        })
      }
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
      margin-left: -0.6rem;
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
        width:8.3rem;
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
    width: 18rem;
    height: 5rem;
    border: 1px solid rgba(50,119,216,1);
    display: block;
    margin: 10px auto;
    padding: .3rem;
    box-sizing: border-box;
  }
}
</style>

