const BASEURL = 'http://www.ichevip.com/api.php/'

const URL = {
    getOauthRedirect: BASEURL + 'Wechat/getOauthRedirect',      //获取微信授权
    getClientInfo: BASEURL + 'Client/getClientInfo',            //获取微信用户信息
    getWxVoucher: BASEURL + 'Orderpay/getWxVoucher',            //微信支付

}

module.exports = URL;