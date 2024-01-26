### 十、终止Promise链条

~~~js
new Promise((resolve, reject) => {
    resolve(111);
}).then(value=>{
    console.log(value);
    console.log(222);
    //
    // return false;
    // throw '出错啦';
    //有且只有一种方式 返回一个pending状态的promise对象
    return new Promise((resolve, reject) => {});
}).then(value => {
    console.log(333);
}).then(value => {
    console.log(444);
}).catch(reason => {
    console.log(reason);
});
~~~
