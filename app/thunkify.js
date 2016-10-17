// 基础依赖
var fs = require('fs');
var thunkify = require('thunkify');

// 延时函数
var asyncFunction = function(info, callback){
  setTimeout(function () {
    callback(null, 'First: ' + info);
    callback(null, 'Second: ' + info); 
  }, .5E3)
};
var asyncErrFunction = function(info, callback){
  setTimeout(function () {
    if(callback){
      throw new Error('出错了');
    }
  }, .5E3)
};
// thunk化的函数
var asyncThunkify = thunkify(asyncFunction);
var asyncErrThunkify = thunkify(asyncErrFunction);
var readFile = thunkify(fs.readFile);

// 自动执行器
var run = function(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
};

// 遍历器函数
var gen = function* (){
  var r1 = yield readFile('file/province.txt', 'utf8');
  var r2 = yield readFile('file/city.txt', 'utf8');
  var r3 = yield asyncThunkify('测试只执行一次');
  console.log([r1, r2, r3]); // [ '广东 山东 福建 湖南 湖北', '广州 梅州 深圳 上海 北京', 'First: 测试只执行一次' ]
};
run(gen);

// 异常中断执行
run(function* () {
  var r1 = yield readFile('file/province.txt', 'utf8');
  var r2 = yield readFile('file/city.txt', 'utf8');
  var r3 = yield asyncErrThunkify('测试异常');
  console.log([r1, r2, r3]); // 异常发生
});
