const BASEURL = 'http://www.ichevip.com/api.php/'

const URL = {
    getSelfInfo: BASEURL + 'Client/getSelfInfo',      //获取用户信息(session)
    getOauthRedirect: BASEURL + 'Wechat/getOauthRedirect',      //获取微信授权
    getClientInfo: BASEURL + 'Client/getClientInfo',            //获取微信用户信息
    addCarInfo: BASEURL + 'Car/addCarInfo',            //绑定车辆页-绑定车辆信息
    getCarList: BASEURL + 'Car/getCarList',            //个人中心-车辆列表信息
    parkingSign: BASEURL + 'Car/parkingSign',            //停车签到
    getOrderPackageList: BASEURL + 'OrderPackage/getOrderPackageList',//获取套餐信息
    createOrder: BASEURL + 'Order/CreateOrder',            //支付页-用户提交、生成订单
    getWxVoucher: BASEURL + 'Orderpay/getWxVoucher',            //支付页-获取凭证信息
    getVillageList: BASEURL + 'Village/getVillageList',            //获取小区列表

    // 洗车工
    signIn: BASEURL + 'Washer/signIn',      //洗车工登录
    getTaskList: BASEURL + 'Washer/getTaskList',      //洗车工获取任务
    getRecord: BASEURL + 'Washer/getRecord',      //洗车工获取洗车记录
    uploadRecordImages: BASEURL + 'Washer/uploadRecordImages',      //洗车工提交上传图片
    basePicUpload: BASEURL + 'Common/basePicUpload',      //洗车工上传图片 base 64
    getClearRecordList: BASEURL + 'clear_record/getClearRecordList',      //洗车记录页-获取30天洗车记录
    getClearRecordDetail: BASEURL + 'clear_record/getClearRecordDetail',      //洗车记录页-洗车记录详情
    setStarLevel: BASEURL + 'clear_record/setStarLevel',      //洗车记录页-评价
    addFeedback: BASEURL + 'Client/addFeedback',      //意见反馈

}

module.exports = URL;