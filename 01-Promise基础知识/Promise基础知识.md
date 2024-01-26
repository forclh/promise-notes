- [一、前言：为什么会出现Promise?](#一前言为什么会出现promise)
- [二、Promise是什么?](#二promise是什么)
  - [2.1  Promise的初体验](#21--promise的初体验)
- [三、使用Promise的好处?](#三使用promise的好处)
  - [3.1  指定回调函数的方式更加灵活](#31--指定回调函数的方式更加灵活)
  - [3.2 可以解决回调地狱问题，支持链式调用](#32-可以解决回调地狱问题支持链式调用)
- [四、Promise实例对象的两个属性](#四promise实例对象的两个属性)
- [五、resolve函数以及reject函数](#五resolve函数以及reject函数)
- [六、Promise对象的状态](#六promise对象的状态)
- [七、Promise的then方法](#七promise的then方法)
- [八、Promise的链式调用](#八promise的链式调用)


### 一、前言：为什么会出现Promise?

Promise的重要性我认为没有必要多讲，概括起来说就是五个字：**必！须！得！掌！握！**。

而且还要掌握透彻，在实际的使用中，有非常多的应用场景我们不能立即知道应该如何继续往下执行。

最常见的一个场景就是ajax请求，通俗来说，由于网速的不同，可能你得到返回值的时间也是不同的，

这个时候我们就需要等待，结果出来了之后才知道怎么样继续下去。

~~~js
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=82294778&appsecret=4PKVFula&city=%E5%8C%97%E4%BA%AC');
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.responseText)
        }
    }
}
~~~

在ajax的原生实现中，利用了onreadystatechange事件，当该事件触发并且符合一定条件时，才能拿到想要的数

据，之后才能开始处理数据，这样做看上去并没有什么麻烦，但如果这个时候，我们还需要另外一个ajax请求，这

个新ajax请求的其中一个参数，得从上一个ajax请求中获取，这个时候我们就不得不等待上一个接口请求完成之

后，再请求后一个接口。

~~~js
let xhr = new XMLHttpRequest();
xhr.open('get', 'https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=82294778&appsecret=4PKVFula&city=%E5%8C%97%E4%BA%AC');
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.responseText)
            
            //伪代码....
            let xhr = new XMLHttpRequest();
            xhr.open('get','http://www.xx.com?a'+xhr.responseText);
            xhr.send();
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status>=200 && xhr.status<300){
                        console.log(xhr.responseText)
                        
                    }
                }
            }
        }
    }
}
~~~

当出现第三个ajax(甚至更多)仍然依赖上一个请求时，我们的代码就变成了一场灾难。

这场灾难，往往也被称为**回调地狱**。

因此我们需要一个叫做Promise的东西，来解决这个问题，当然，除了回调地狱之外，还有个非常重要的需求就是

**为了代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来**。

上面的写法，是完全没有区分开，当数据变得复杂时，也许我们自己都无法轻松维护自己的代码了。

这也是模块化过程中，必须要掌握的一个重要技能，请一定重视。

### 二、Promise是什么?

> Promise是异步编程的一种解决方案，比传统的解决方案回调函数更合理、更强大。
>
> ES6将其写进了语言标准，统一了用法，原生提供了Promise对象。
>
> 指定回调函数的方式也变得更加灵活易懂，也解决了异步`回调地狱`的问题
>
> 旧方案是单纯使用回调函数，常见的异步操作有：定时器、fs模块、ajax、数据库操作  
>
> 从语法上说，Promise是一个构造函数；
>
> 从功能上说，Promise对象用来封装一个异步操作并可以获取其成功/失败的结果值。

#### 2.1  Promise的初体验

创建promise对象（pending状态）

```js
const p = new Promise(executor);
```

其中：

executor函数:  执行器  (resolve, reject) => {}

resolve函数: 内部定义成功时我们调用的函数 value => {}

reject函数: 内部定义失败时我们调用的函数 reason => {}

executor会在Promise内部立即同步调用,异步操作在执行器中执行

实例对象调用Promise原型中的then方法来完成对结果的处理

~~~js
const p = new Promise((resolve, reject) => {
    //如果咱们公司今年挣钱了，年底就发奖金，否则不发
    resolve('ok');
})
console.log(p)
p.then(() => {
    console.log('发奖金')
}, () => {
    console.log('不发奖金')
})
~~~

### 三、使用Promise的好处?

#### 3.1  指定回调函数的方式更加灵活

1. 旧的：必须在启动异步任务前指定

2. promise：启动异步任务->返回promise对象->给promise对象绑定回调函数

   (甚至可以在异步任务结束后指定/多个)

#### 3.2 可以解决回调地狱问题，支持链式调用

 1. 什么是回调地狱？

    回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调执行的条件

   2. 回调地狱的缺点?

      不便于阅读

      不便于异常处理

   3. 解决方案？

      promise链式调用

4. 终极解决方案？

   async/await

### 四、Promise实例对象的两个属性

- PromiseState

  此属性为promise对象的状态属性。

  - fulfilled：成功的状态
  - rejected：失败的状态
  - pending：初始化的状态

  【注】状态只能由pending->fulfilled 或者是 pending->rejected

- PromiseResult

  此属性为promise对象的结果值（resolve以及reject函数的形参值）

### 五、resolve函数以及reject函数

- resolve：修改promise对象的状态，由pending修改到fulfilled；将实参设置到这个属性PromiseResult中。
- reject：修改promise对象的状态，由pending修改到rejected；将实参设置到这个属性PromiseResult中。

案例1：利用promise来进行读取文件操作

~~~js
//1.普通文件读取方式
const fs = require('fs');

//2.直接利用readfile来进行读取
/* fs.readFile(__dirname + '/data.txt',(err,data)=>{
    if(err) throw err;
    console.log(data.toString());
}) */

//3.利用promise来实现文件的读取
const p = new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/data.txt', (err, data) => {
        if (err) {
            reject(err);
        }else{
            resolve(data);
        }
    })
}); 

p.then(value=>{
    console.log(value.toString());
},reason=>{
    console.log(reason);
})
~~~

案例2：利用promise进行ajax请求

~~~js
<body>
    <button>发送ajax请求</button>
    <script>
        //1.获取DOM元素对象
        let btn = document.querySelector('button');
        //2.绑定事件
        btn.onclick = function(){
            //3.创建promise实例对象
            const p = new Promise((resolve,reject)=>{
                //4.创建ajax实例对象
                const xhr = new XMLHttpRequest();
                //5.打开请求
                xhr.open('get','https://www.yiketianqi.com/free/day?appid=82294778&appsecret=4PKVFula&unescape=1');
                //6.发送请求
                xhr.send();
                //7.利用onreadystatechange事件
                xhr.onreadystatechange = function(){
                    //8.判断
                    if(xhr.readyState == 4){
                        if(xhr.status == 200){
                            resolve(xhr.responseText);
                        }else{
                            reject(xhr.response);
                        }
                    }
                }
            });
            p.then(value=>{
                console.log(JSON.parse(value));
            },reason=>{
                console.log('获取信息失败');
            })
        }
    </script>
</body>
~~~

案例3：利用promise进行数据库操作

~~~js
const mongoose = require('mongoose');

new Promise((resolve, reject) => {
    mongoose.connect('mongodb://127.0.0.1/project');
    mongoose.connection.on('open', ()=>{
        //连接成功的情况
        resolve();
    });

    mongoose.connection.on('error', () => {
        //连接失败的情况
        reject();
    })
}).then(value => {
    //创建结构
    const NoteSchema = new mongoose.Schema({
        title: String,
        content: String
    })
    //创建模型
    const NoteModel = mongoose.model('notes', NoteSchema);

    //读取操作
    NoteModel.find().then(value => {
        console.log(value);
    }, reason => {
        console.log(reason);
    })
}, reason => {
    console.log('连接失败');
})
~~~

案例4：封装一个函数，作用是读取文件

~~~js
const fs = require('fs');

function ReadFileFun(path){
    return new Promise((resolve,reject)=>{
         fs.readFile(path,(err,data)=>{
              //判断
              if(err){
                    reject(err)
              }else{
                    resolve(data);
              }
         })
    });
}

ReadFileFun('./data.txt').then(value=>{
    console.log(value.toString());
},reason=>{
    console.log(reason);
})
~~~

node中的promisify

- promisify  (只能在 NodeJS 环境中使用)
- promisify 是 util 模块中的一个方法  util 是 nodeJS 的内置模块
- 作用: 返回一个新的函数, 函数的是 promise 风格的.

~~~js
const util = require('util');
const fs = require('fs');
//通过 fs.readFile 创建一个新的函数
const mineReadFile = util.promisify(fs.readFile);

mineReadFile('./resource/2.html')
.then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
})
~~~

### 六、Promise对象的状态

Promise对象通过自身的状态来控制异步操作，Promise实例具有三种状态.

- 异步操作未完成：pending
- 异步操作成功：fulfilled
- 异步操作失败：rejected

这三种的状态的变化途径只有两种

- 从pending(未完成)到fulfilled(成功)
- 从pending(未成功)到rejected(失败)

一旦状态发生变化，就凝固了，不会再有新的状态变化，这也是Promise这个名字的由来，它的英语意思"承诺"，

一旦承诺生效，就不得再改变了，这也意味着Promise实例的状态变化只可能发生一次。

在Promise对象的构造函数中，将一个函数作为第一个参数。而这个函数，就是用来处理Promise的状态变化。

上面的resolve和reject都为一个函数，他们的作用分别是将状态修改为resolved和rejected。

因此，Promise的最终结果只有两种。

~~~js
异步操作成功，Promise实例传回一个值(value)，状态变为fulfilled.
异步操作失败，Promise实例抛出一个错误(error),状态变为rejected
~~~

### 七、Promise的then方法

then：指定用于得到成功value的成功回调和用于得到失败reason的失败回调，`返回一个新的promise对象`

- 成功的状态：执行第一个回调函数
- 失败的状态：执行第二个回调函数

promise.then()返回的新promise的结果状态由什么决定?

(1) 简单表达: 由then()指定的回调函数执行的结果决定

(2) 详细表达:

① 如果抛出异常, 新promise变为rejected, reason为抛出的异常

~~~js
const p = new Promise((resolve,reject)=>{
     resolve('ok');
});

let result = p.then(value=>{
	throw '错误';
},reason=>{
	console.log(reason);
});

console.log(result);
~~~

② 如果返回的是非promise的任意值, 新promise变为fulfilled, PromiseResult为返回的值

~~~js
const p = new Promise((resolve,reject)=>{
                resolve('ok');
});

let result = p.then(value=>{
	return 100;
},reason=>{
	console.log(reason);
});

console.log(result);
~~~

③ 如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果 

~~~js
const p = new Promise((resolve,reject)=>{
                resolve('ok');
});

let result = p.then(value=>{
	return new Promise((resolve,reject)=>{
		//resolve('111');
        reject('error');
	})
},reason=>{
	console.log(reason);
});

console.log(result);
~~~

### 八、Promise的链式调用

~~~js
const p = new Promise((resolve,reject)=>{
	//resolve('ok');
    reject('error');
});

p.then(value=>{
	console.log(value);
},reason=>{
	console.log(reason);
}).then(value=>{
	console.log(value);
},reason=>{
	console.log(reason);
})
~~~

案例：通过promise的链式调用来读取文件

回调地狱的方式：

~~~js
const fs = require('fs');
fs.readFile('./resource/1.html',(err,data1)=>{
    if(err) throw err;
    fs.readFile('./resource/1.html',(err,data2)=>{
    	if(err) throw err;
        fs.readFile('./resource/1.html',(err,data3)=>{
    		if(err) throw err;
            console.log(data1 + data2 + data3);
		})
	})
})
~~~

Promise的形式：

需求：读取resource下三个文件内容，并在控制台合并输出

~~~js
new Promise((resolve,reject)=>{
	fs.readFile('./resource/1.html',(err,data)=>{
		 //如果失败 则修改promise对象状态为失败
        if(err) reject(err);
        //如果成功 则修改promise对象状态为成功
        resolve(data);
	})
}).then(value=>{
    return new Promise((resolve,reject)=>{
        fs.readFile('./resource/2.html',(err,data)=>{
             //失败
            if(err) reject(err);
            //成功
            resolve([value,data]);
        })
	})
}).then(value=>{
    return new Promise((resolve,reject)=>{
        fs.readFile('./resource/3.html',(err,data)=>{
             //失败
            if(err) reject(err);
            value.push(data);
            //成功
            resolve(value);
        })
	})
}).then(value=>{
    console.log(value.join(""));
})
~~~
