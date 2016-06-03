function address(state) {
  var _state = state;
  return function(city) {
    var _city = city;
    return function(town) {
      return _state + '省, ' + _city + '市, ' + town + '区';
    }
  }
}

var GuangDong = address('广东');
var GuangZhou = GuangDong('广州');
var TianHe = GuangZhou('天河');
var ShenZhen = GuangDong('深圳');
var LuoHu = ShenZhen('罗湖');
var BaoAn = ShenZhen('宝安');

GuangDong = function (){console.log('nothing')};
GuangDong();
console.log(TianHe);
console.log(LuoHu);
console.log(BaoAn);
