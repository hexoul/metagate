function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = year + ' / ' + month + ' / ' + date;
    return time;
}

function convertHexToString(input) {
    var hex = input.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
    timeConverter,
    sleep,
    convertHexToString,
}