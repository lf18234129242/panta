const MD5 = {
    access_date : getAccessDate(),
    api_key 	: ';qP)xZg]fEe^op*Cl52`',
    prefix_str 	: 'PanTa',
}


function getAccessDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + month + strDate;
    return currentdate;
}

module.exports = MD5;