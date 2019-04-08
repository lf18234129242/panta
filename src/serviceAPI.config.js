const BASEURL = 'http://www.ichevip.com/api.php/'

const URL = {
    getSelfInfo: BASEURL + 'Client/getSelfInfo',      //获取用户信息(session)
    getOauthRedirect: BASEURL + 'Wechat/getOauthRedirect',      //获取微信授权
    getClientInfo: BASEURL + 'Client/getClientInfo',            //获取微信用户信息
    addCarInfo: BASEURL + 'Car/addCarInfo',            //绑定车辆页-绑定车辆信息
    getCarList: BASEURL + 'Car/getCarList',            //个人中心-车辆列表信息
    editCarInfo: BASEURL + 'Car/editCarInfo',            //修改车辆信息 & 停车签到
    getOrderPackageList: BASEURL + 'OrderPackage/getOrderPackageList',//获取套餐信息
    createOrder: BASEURL + 'Order/CreateOrder',            //支付页-用户提交、生成订单
    getWxVoucher: BASEURL + 'Orderpay/getWxVoucher',            //支付页-获取凭证信息
    getVillageList: BASEURL + 'Village/getVillageList',            //获取小区列表

}

module.exports = URL;