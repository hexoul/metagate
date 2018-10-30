import web3 from './ethereum/web3';

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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function refine(m) {
  Object.keys(m).forEach(key => {
    if (! isNaN(key)) return delete m[key];
    switch (key) {
      case 'title': m[key] = convertHexToString(m[key]); break;
      case 'explanation': m[key] = convertHexToString(m[key]); break;
      case 'reward': m[key] = web3.utils.fromWei(m[key], 'ether') + 'META'; break;
      case 'createdAt': m[key] = timeConverter(Date(m[key])); break;
      default: if (! m[key]) m[key] = ''; break;
    }
  });
  return m;
}

function isValidLength(str) {
  var encoder = new TextEncoder('utf-8');
  return encoder.encode(str).length;
}

export {
    timeConverter,
    sleep,
    convertHexToString,
    asyncForEach,
    refine,
    isValidLength
}