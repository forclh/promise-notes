- [十二、async和await](#十二async和await)
  - [12.1  async函数](#121--async函数)
  - [12.2  await表达式](#122--await表达式)


### 十二、async和await

async/await 是ES7提出的基于Promise的解决异步的最终方案。

#### 12.1  async函数

async是一个加在函数前的修饰符，被async定义的函数会默认返回一个Promise对象resolve的值。

因此对async函数可以直接then，返回值就是then方法传入的函数。

~~~js
// async基础语法
async function fun0(){
    console.log(1);
    return 1;
}
fun0().then(val=>{
    console.log(val) // 1,1
})

async function fun1(){
    console.log('Promise');
    return new Promise(function(resolve,reject){
        resolve('Promise')
    })
}
fun1().then(val => {
    console.log(val); // Promise Promise
}
~~~

~~~js
//声明一个async函数
async function main() {
    console.log('async function');
    //情况1：返回非promise对象数据
    return 'hahaha';
    //情况2：返回是promise对象数据
    /* return new Promise((resolve, reject) => {
		// resolve('ok');
		reject('error');
	}) */
    //情况3：抛出异常
    // throw new Error('出错啦!!!');
}
let result = main().then(value => {
    console.log(value);
});
console.log(result);
~~~

#### 12.2  await表达式

await 也是一个修饰符，只能放在async定义的函数内。可以理解为**等待**。

await 修饰的如果是Promise对象，可以获取Promise中返回的内容（resolve或reject的参数），且取到值后语

句才会往下执行；如果不是Promise对象：把这个非promise的东西当做await表达式的结果。

注意事项

- await必须写在async函数中，但是async函数中可以没有await
- 如果await的promise失败了，就会抛出异常，需要通过try...catch捕获处理

~~~js
async function fun(){
    let a = await 1;
    let b = await new Promise((resolve,reject)=>{
        setTimeout(function(){
            resolve('setTimeout')
        },3000)
    })
    let c = await function(){
        return 'function'
    }()
    console.log(a,b,c)
}
fun(); // 3秒后输出： 1 "setTimeout" "function"
~~~

~~~js
function log(time){
    setTimeout(function(){
        console.log(time);
        return 1;
    },time)
}
async function fun(){
    let a = await log(1000);
    let b = await log(3000);
    let c = log(2000);
    console.log(a);
    console.log(1)
}
fun(); 
// 立即输出 undefined 1
// 1秒后输出 1000
// 2秒后输出 2000
// 3秒后输出 3000
~~~

~~~js
async function main() {
    //1、如果await右侧为非promise类型数据
    var rs = await 10;
    var rs = await 1 + 1;
    var rs = await "非常6+7";

    //2、如果await右侧为promise成功类型数据
    var rs = await new Promise((resolve, reject) => {
        resolve('success');
    })

    //3、如果await右侧为promise失败类型数据,需要借助于try...catch捕获
    try {
        var rs = await new Promise((resolve, reject) => {
            reject('error');
        })
        } catch (e) {
            console.log(e);
        }
}
main();
~~~

~~~js
// 使用async/await获取成功的结果

// 定义一个异步函数，3秒后才能获取到值(类似操作数据库)
function getSomeThing(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('获取成功')
        },3000)
    })
}

async function test(){
    let a = await getSomeThing();
    console.log(a)
}
test(); // 3秒后输出：获取成功
~~~

案例：async结合await读取文件内容

~~~js
//1、导包
const fs = require('fs');
const {promisify} = require('util');
//2、将fs.readFile转化成promise风格的函数
const myreadfile = promisify(fs.readFile);
//3、声明async函数
async function main(){
    try{
        //4、读取文件
        let one = await myreadfile('./resource/4.html');
        let two = await myreadfile('./resource/2.html');
        let three = await myreadfile('./resource/3.html');
    //5、拼接读取文件内容
    console.log(one + two + three);
    }catch(e){
        console.log(e);
    }
}
//6、调用main函数
main();
~~~
