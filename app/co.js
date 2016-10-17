var fs = require('fs');
var thunkify = require('thunkify');
var co = require('co');

var asyncFunction = function(info, callback){
  setTimeout(function () {
    callback(null, 'First: ' + info);
    callback(null, 'Second: ' + info);
  }, .5E3)
};
var asyncThunkify = thunkify(asyncFunction);
var readFile = thunkify(fs.readFile);
// 遍历器函数
var gen = function* (){
  var r1 = yield readFile('file/province.txt', 'utf8');
  var r2 = yield readFile('file/city.txt', 'utf8');
  var r3 = yield asyncThunkify('测试只执行一次');
  console.log([r1, r2, r3]); // [ '广东 山东 福建 湖南 湖北', '广州 梅州 深圳 上海 北京', 'First: 测试只执行一次' ]
};
co(gen).then(function(){
    console.log("函数执行完成！");
});