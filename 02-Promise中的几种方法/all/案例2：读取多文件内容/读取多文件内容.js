// 1. 导入模块
const fs = require('fs');
const util = require('util');

// 2. 调用方法
// util.promisify是一个工具方法，用于将基于回调的函数转换为返回Promise的函数。
// 它接受一个函数作为参数，返回一个新的函数，该新函数返回一个Promise对象。
// 当新函数被调用时，它会调用原始函数并传递相同的参数，然后根据原始函数的回调结果来决定Promise的状态。
const myReadFile = util.promisify(fs.readFile);

// 3. 读取文件
let one = myReadFile('./resource/1.txt');
let two = myReadFile('./resource/2.txt');
let three = myReadFile('./resource/3.txt');

let result = Promise.all([one, two, three]);
result.then(value => console.log(value.toString()), reason => console.log(reason));