- [九、Promise下的几种方法](#九promise下的几种方法)
  - [9.1 Promise.resolve()](#91-promiseresolve)
  - [9.2 Promise.reject()](#92-promisereject)
  - [9.3 Promise.catch()](#93-promisecatch)
  - [9.4 Promise.all()](#94-promiseall)
  - [9.5 Promise.race()](#95-promiserace)
  - [9.6 Promise.allSettled()](#96-promiseallsettled)
  - [9.7 Promise.any()](#97-promiseany)
  - [9.8 Promise.finally()](#98-promisefinally)


### 九、Promise下的几种方法

#### 9.1 Promise.resolve()

将一个普通值转化为promise类型的数据

- 若参数为非promise对象，则返回的结果为成功状态的promise对象

~~~js
let p1 = Promise.resolve(123);
console.log(p1);
let p2 = Promise.resolve(undefined);
console.log(p2);
~~~

- 若参数为promise对象，参数的状态决定返回结果的状态

~~~js
let p3 = Promise.resolve(new Promise((resolve,reject)=>{
	resolve('success');
}));
console.log(p3);

let p4 = Promise.resolve(Promise.resolve(Promise.resolve("OK")));
console.log(p4);
~~~

#### 9.2 Promise.reject()

返回的结果`始终为失败的Promise对象`

~~~js
console.log(Promise.reject(123));
console.log(Promise.reject(Promise.resolve('ok')));
~~~

#### 9.3 Promise.catch()

功能是用来指定失败的回调函数

~~~js
let p = new Promise((resolve,reject)=>{
	//resolve('success');
    reject('error');
});

p.catch(reason=>{
    console.log(reason);
});

//then方法中不是必须传入两个参数，可以只传递成功时的回调函数
//也可以单独使用catch来指定失败的回调函数

//异常（错误）穿透
//当如果有多个需要执行的成功时的回调函数，可以不需要每一次都写失败回调，可以统一最后利用catch
//当如果promise对象的状态为reject的话，会一直向下穿透直到catch方法
p.then(value=>{
    console.log(value);
}).then(value=>{
    console.log(value);
}).catch(reason=>{
    console.log(reason);
})
~~~

#### 9.4 Promise.all()

作用：针对于多个Promise的异步任务进行处理

接收的参数：promise数组

返回值：promise对象，状态由`promise数组中的对象状态`决定

- 若每个对象状态`都为`成功，则返回的promise对象状态为成功，

​		 成功的结果值为`每个promise对象成功结构值组成的数组`

-  若`其中一个对象`状态为失败，则返回的promise对象状态为失败，

​	    失败的结果值为`失败的promise对象的结果值`

~~~js
let p1 = new Promise((resolve, reject) => {
            resolve('ok');
})
let p2 = Promise.resolve('hello');
let p3 = Promise.resolve('oh yeah');
let result = Promise.all([p1, p2, p3])
console.log(result);
~~~

当有一个ajax请求，它的参数需要另外2个甚至更多请求都有返回结果之后才能确定，

那么这个时候，就需要用到Promise.all来帮助我们应对这个场景。

Promise.all接收一个Promise对象组成的数组作为参数，

当这个数组所有的Promise对象状态都变成resolved或者rejected的时候，它才会去调用then方法。

~~~js
//ES6中对Promise.all()的理解以及应用场景
//用于将多个Promise实例，包装成一个新的Promise实例
let p1 = new Promise((resolve,reject)=>{
   resolve('成功01');
})
let p2 = new Promise((resolve,reject)=>{
	resolve('成功02');
}).catch(reason=>console.log(reason));
let p3 = new Promise((resolve,reject)=>{
	resolve('成功03');
})
//参数可以不是数组，但必须是iterator接口
let pAll = Promise.all([p1,p2,p3]);
console.log(pAll)
//pAll的状态是由p1,p2,p3来决定，只有当这三个都为成功，pAll才会为成功,反之，但凡其中一个失败结果就是失败
//这个时候第一个失败的实力的返回值会传递给pAll的回调函数，如果作为参数的实例，自己定义了catch方法，那么它一旦为rejected，是不会触碰到pAll中的catch方法
pAll.then(value=>{
	console.log(value);
},reason=>{
	console.log(reason);
})
~~~

案例1：模拟请求三个接口中的数据，全部请求成功后获取。

~~~js
function getUsersList() {
    return new Promise((resolve, reject) => {
        //模拟请求用户列表数据
        setTimeout(() => {
            resolve('用户列表的数据');
        }, 1000);
    })
}
function getBannersList() {
    return new Promise((resolve, reject) => {
        //模拟请求用户列表数据
        setTimeout(() => {
            resolve('轮播图的数据');
        }, 2000);
    })
}
function getVideoList() {
    return new Promise((resolve, reject) => {
        //模拟请求用户列表数据
        setTimeout(() => {
            resolve('视频列表的数据');
        }, 3000);
    })
}
//初始加载的时候
function initLoad() {
    let all = Promise.all([getUsersList(), getBannersList(), getVideoList()]);
    //获取成功请求的结果值
    all.then(value => {
        console.log(value);
    })
}
initLoad();
~~~

案例2：修改多文件读取代码

~~~js
const fs = require('fs');
const util = require('util');
const mywriteFile = util.promisify(fs.readFile);
let one = mywriteFile('./resource/1.html');
let two = mywriteFile('./resource/2.html');
let three = mywriteFile('./resource/3.html');
let result = Promise.all([one,two,three]);
result.then(value=>{
    console.log(value.join(''));
},reason=>{
    console.log(reason);
})
~~~

#### 9.5 Promise.race()

Promise.race  race 赛跑的意思

参数: promise 数组

返回结果: promise 对象

状态由『最先改变状态的 promise对象』决定 

结果值由 『最先改变状态的 promise对象』决定

~~~js
let p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('ok');
            }, 2000)
});
let p2 = Promise.resolve('success');
let p3 = Promise.resolve('oh hou');
let result = Promise.race([p1, p2, p3]);
console.log(result);
~~~

与Promise.all相似的是，Promise.race都是以一个Promise对象组成的数组作为参数。

不同的是，只要当数组中的其中一个Promsie状态变成resolved或者rejected时，就可以调用.then方法了。

而传递给then方法的值也会有所不同。

~~~js
<script>
    //ES6中Promise.race的用法以及使用场景
    //将多个Promise实例包装成一个新的Promise实例
    let p1 = new Promise((resolve, rejct) => {
        setTimeout(() => {
            resolve('p1成功')
        }, 2000);
    })
    let p2 = new Promise((resolve, rejct) => {
        setTimeout(() => {
            resolve('p2成功');
        }, 1000);
    }, 1000);
    //调用
    const prace = Promise.race([p1, p2]);
    //Promise.race区别于Promise.all：
    //只要是实例中有一个先改变状态，就会把这个实例的返回值传递给prace的回调函数
</script>
~~~

~~~js
//使用场景：请求超时提示
function request() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('请求成功');
        }, 4000);
    })
}
function timeout() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('网络不畅,请求超时');
        }, 3000);
    });
}
Promise.race([request(), timeout()]).then(value => {
    console.log(value)
}).catch(reason => {
    console.log(reason)
})
~~~

#### 9.6 Promise.allSettled()

Promise.allSettled()方法，用来确定要一组异步操作是否都结束了(不管成功或失败)。

所以，它的名字叫"Settled"，包含了"fufilled"和"rejected"两种情况.

~~~js
<script>
    function ajax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.responseText);
                }
            }
        }
    })

}
//类比Promise下的all方法和allSettled
// Promise.all([ajax('http://www.xiongmaoyouxuan.com/api/tabs'),
// ajax('https://m.maizuo.com/gateway?cityId=110100&k=4770248')
// ]).then(value => {
//     console.log(value)
// }).catch(error => {
//     console.log(error);
// })

Promise.allSettled([ajax('http://www.xiongmaoyouxuan.com/api/tabs'),
                    ajax('https://m.maizuo.com/gateway?cityId=110100&k=4770248')
                   ]).then(value => {
    // console.log(value)
    let successList = value.filter(item => item.status === 'fulfilled');
    console.log(successList)

    let errorList = value.filter(item => item.status === 'rejected');
    console.log(errorList)
}).catch(error => {
    console.log(error);
})
</script>
~~~

#### 9.7 Promise.any()

只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfiilled状态；

如果所有参数实例都变成rejected，包装实例就会变成rejected状态。

> Promise.any()跟Promise.race()方法很像，但是有一点不同，
>
> 就是Promise.any()不会因为某个Promise变成rejected状态而结束，
>
> 必须等到所有参数Promise变成rejected状态才会结束。

~~~js
<script>
    let p1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok');
        }, 1000)
    })
    let p2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('okk');
        }, 2000)
    })
    let p3 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('error');
        }, 3000)
    })
    Promise.any([p1, p2, p3]).then(res => {
        console.log(res)
    }).catch(err => {
        console.log('error')
    })
</script>
~~~

#### 9.8 Promise.finally()

finally是在ES9(ES2018)中新增的一个特性：表示无论Promise对象变成fufilled还是rejected状态，最终都会被执行。

finally方法中的`回调函数`是不接受参数的，因为无论前面是fulfilled状态还是rejected状态， 它都是执行。

~~~js
const p = new Promise((resolve, reject) => {
    // resolve('ok');
    reject('error');
});
p.then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
}).finally(() => {
    console.log('finally')
})
~~~
