<template>
  <div id="app" ref="app">
    <transition :name="transitionName">
      <!-- <keep-alive include="carWasher-admin"> -->
        <router-view/>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transitionName: 'fold-left'
    }
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index){
        this.transitionName = 'fold-left';
        }else{
        this.transitionName = 'fold-right';
      }
    },
  }
}
</script>


<style>
@import url(./assets/css/base.css);
html,body,#app {
  /* position: fixed; */
  width: 100%;
  /* height: 100%; */
  margin: 0;
  padding: 0;
  /* overflow: scroll; */
}

.fold-left-enter-active {
    animation-name: fold-left-in;
    animation-duration: .3s;
  }
  .fold-left-leave-active {
    animation-name: fold-left-out;
    animation-duration: .3s;
  }
  @keyframes fold-left-in {
    0% {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      /* visibility: visible; */
    }
    /*50% {
      transform: translate3d(50%, 0, 0);
    }*/
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-left-out {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    /*50% {
      transform: translate3d(-50%, 0 , 0);
    }*/
    100% {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      /* visibility: hidden; */
    }
  }
  .fold-right-enter-active {
    animation-name: fold-right-in;
    animation-duration: .3s;
  }
  .fold-right-leave-active {
    animation-name: fold-right-out;
    animation-duration: .3s;
  }
  @keyframes fold-right-in{
    0% {
      width: 100%;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      /* visibility: visible; */
    }
    /*50% {
      transform: translate3d(50%, 0, 0);
    }*/
    100% {
      width: 100%;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes fold-right-out  {
    0% {
      width: 100%;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    /*50% {
      transform: translate3d(-50%, 0 , 0);
    }*/
    100% {
      width: 100%;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      /* visibility: hidden; */
    }
  }
  
.loading-box{
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
