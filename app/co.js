// 基础依赖
var fs = require('fs');
var thunkify = require('thunkify');
var co = require('co');

// 延时执行函数
var asyncFunction = function(info, callback){
  setTimeout(function () {
    callback(null, 'First: ' + info);
    callback(null, 'Second: ' + info);
  }, .5E3)
};
// thunk化的函数
var asyncThunkify = thunkify(asyncFunction);
var readFile = thunkify(fs.readFile);

// 遍历器函数
var gen = function* (){
  var r1 = yield readFile('file/province.txt', 'utf8');
  var r2 = yield readFile('file/city.txt', 'utf8');
  var r3 = yield asyncThunkify('测试只执行一次');
  console.log([r1, r2, r3]); // [ '广东 山东 福建 湖南 湖北', '广州 梅州 深圳 上海 北京', 'First: 测试只执行一次' ]
};

// co回调函数
co(gen).then(function(){
    console.log("函数执行完成！");
});

// 异常处理
var onerror = function(err) {
  // console.error(err.stack);
  console.log(err.message);
}

// 并发处理
co(function* () {
  var res = yield [
    readFile('file/province.txt', 'utf8')
    ,readFile('file/city.txt', 'utf8')
  ];
  console.log('并发请求结果（数组）：%s', JSON.stringify(res));
}).catch(onerror);

co(function* () {
  var res = yield {
    province: readFile('file/province.txt', 'utf8')
    ,city: readFile('file/city.txt', 'utf8')
  };
  console.log('并发请求结果（对象）：%s', JSON.stringify(res));
}).catch(onerror);

// 异常中断执行
co(function* () {
  var res = yield {
    province: readFile('file/province.txt', 'utf8')
    ,city: readFile('file/city.txt', 'utf8')
    ,error: Promise.reject(new Error('boom'))
  };
  console.log('并发请求结果（对象）：%s', JSON.stringify(res));
}).catch(onerror);