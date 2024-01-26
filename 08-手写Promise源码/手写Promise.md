- [十五、手写promise自定义基础结构的搭建](#十五手写promise自定义基础结构的搭建)
	- [15.1   Promise 的基本结构](#151---promise-的基本结构)
	- [15.2  Promise实例拥有两个实例属性](#152--promise实例拥有两个实例属性)
	- [15.3 更改状态三种方式-方法未抽离](#153-更改状态三种方式-方法未抽离)
	- [15.4  更改状态三种方式-抽离为普通函数](#154--更改状态三种方式-抽离为普通函数)
	- [15.5   更改状态三种方式-抽离为箭头函数](#155---更改状态三种方式-抽离为箭头函数)
	- [15.6   状态只允许更改一次](#156---状态只允许更改一次)
	- [15.7  then函数调用成功或失败回调函数](#157--then函数调用成功或失败回调函数)
	- [15.8  then函数中的回调函数是异步调用的](#158--then函数中的回调函数是异步调用的)
	- [15.9  then函数返回的是一个Promise实例](#159--then函数返回的是一个promise实例)
	- [15.10  then函数返回的Promise实例状态以及值-未优化](#1510--then函数返回的promise实例状态以及值-未优化)
	- [15.11   then函数返回的Promise实例状态以及值-优化封装函数\_common](#1511---then函数返回的promise实例状态以及值-优化封装函数_common)
	- [15.12  增加成功与失败回调函数的默认值](#1512--增加成功与失败回调函数的默认值)
	- [15.14   执行器函数常用于处理异步行为](#1514---执行器函数常用于处理异步行为)
	- [15.15  可以指定多个成功或失败的回调](#1515--可以指定多个成功或失败的回调)
	- [15.16  catch](#1516--catch)
	- [15.17  链式调用支持](#1517--链式调用支持)
	- [15.18   异常穿透支持](#1518---异常穿透支持)
	- [15.19   中断Promise链](#1519---中断promise链)
	- [15.20  resolve](#1520--resolve)
	- [15.21  reject](#1521--reject)
	- [15.22 完成all](#1522-完成all)
	- [15.23 完成race](#1523-完成race)
	- [15.24 class版本实现Promise](#1524-class版本实现promise)

### 十五、手写promise自定义基础结构的搭建

#### 15.1   Promise 的基本结构

~~~js
/**
 * 1- Promise 是一个构造函数
 * 2- Promise 接收一个参数，该参数的类型是函数（执行器函数executor）
 * 3- executor接收两个参数（resolve,reject）,参数的类型是函数
 * 4- 执行器函数会同步执行。
 * 5- then方法在其显式原型属性上
 */

// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
    // executor是执行器函数
    function Promise(executor){
        executor(function(){

        },function(){

        });
    }
    window.Promise = Promise;
})(window);
~~~

~~~js
new Promise((resolve, reject)=>{
    console.log("这是我的执行器函数",resolve,reject)
})
console.log("over",Promise);
~~~

#### 15.2  Promise实例拥有两个实例属性

~~~js
/*
 * 1- Promise实例拥有两个实例属性：
 * 状态（[[PromiseState]]），初始状态为pending
 * 值（[[PromiseResult]]）,初始值为undefined
*/ 
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		executor(function(){
		
		},function(){
		
		});
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
	console.log("这是我的执行器函数",resolve,reject)
})
console.log(p1);
~~~

#### 15.3 更改状态三种方式-方法未抽离

~~~js
/*
 * 更改状态三种方式
 * 1- 通过调用resolve将状态更改为成功（fulfilled），接收的值为成功值
 * 2- 通过调用reject将状态更改为失败(rejected)，接收的值为失败值
 * 3- 抛出异常将状态更改为失败(rejected)，失败的值为异常信息。
*/
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		try{
			executor(function(value){
				// 将状态更改为成功(fulfilled)
				this.state = "fulfilled";
				// 成功值为value
				this.result = value;
			}.bind(this),function(value){
				// 将状态更改为失败
				this.state = "rejected";
				// 将result设置为value
				this.result = value;
			}.bind(this));
		}catch (err){
			// 将状态更改为失败
			this.state = "rejected";
			// 将异常信息作为失败值
			this.result = err;
		}
		
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    // reject(2);
    throw "异常"
})
console.log(p1);
~~~

#### 15.4  更改状态三种方式-抽离为普通函数

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = function(value){
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}.bind(this)
		// 定义reject函数
		const _reject = function(value){
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}.bind(this)
		try{
			executor(_resolve,_reject);
		}catch (err){
			// 将状态更改为失败
			this.state = "rejected";
			// 将异常信息作为失败值
			this.result = err;
		}
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    reject(2);
    // throw "异常"
})
console.log(p1);
~~~

#### 15.5   更改状态三种方式-抽离为箭头函数

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			// 将状态更改为失败
			this.state = "rejected";
			// 将异常信息作为失败值
			this.result = err;
		}
		
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    // reject(2);
    throw "异常"
})
console.log(p1);
~~~

#### 15.6   状态只允许更改一次

~~~js
/*
 * pending-> fulfilled
 * pending-> rejected
 * 改变状态只有这两种，且一个promise对象只能改变一次，，无论变成成功还是失败，都会有一个结果值
 * 成功的结果数据一般称为value，失败的结果值一般称为reason
*/
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    resolve(1);
    reject(2);
    throw "异常"
})
console.log(p1);
~~~

#### 15.7  then函数调用成功或失败回调函数

~~~js
/*
 * 1- then是Promise中的原型方法
 * 2- then函数接收两个参数（成功回调，失败回调）
 * 3- 如果p1状态为成功执行成功回调，失败执行失败回调。
*/
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 状态成功调用onResolved
			if(this.state === "fulfilled"){
				onResolved(this.result);
			}else if(this.state === "rejected"){
				onRejected(this.result);
			}
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

#### 15.8  then函数中的回调函数是异步调用的

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 状态成功调用onResolved
			if(this.state === "fulfilled"){
				// 异步调用
				setTimeout(()=>{
					onResolved(this.result);
				})
				
			}else if(this.state === "rejected"){
				// 异步调用
				setTimeout(()=>{
					onRejected(this.result);
				})
			}
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    // reject(2);
    throw "异常"
})
p1.then(value=>{
    console.log("成功回调",value);
},reason=>{
    console.log("失败回调",reason);
})
console.log("over");
~~~

#### 15.9  then函数返回的是一个Promise实例

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			return new Promise((resolve,reject)=>{
				// 状态成功调用onResolved
				if(this.state === "fulfilled"){
					// 异步调用
					setTimeout(()=>{
						onResolved(this.result);
					})
					
				}else if(this.state === "rejected"){
					// 异步调用
					setTimeout(()=>{
						onRejected(this.result);
					})
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    // reject(2);
    throw "异常"
})
const p2 = p1.then(value=>{
    console.log("成功回调",value);
},reason=>{
    console.log("失败回调",reason);
})
console.log(p2);
~~~~

#### 15.10  then函数返回的Promise实例状态以及值-未优化

~~~js
/*
 * then返回的Promise实例受成功或失败回调函数返回值的影响
 * 1- 如果返回的是非Promise,那么p2状态为成功，值为返回值
 * 2- 如果返回的是Promise,那么p2状态以及值与返回的状态，值相同。
 * 3- 如果出现异常，那么p2状态为失败，值为异常信息。
*/
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			return new Promise((resolve,reject)=>{
				// 状态成功调用onResolved
				if(this.state === "fulfilled"){
					// 异步调用
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = onResolved(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise){
								// value.then(v=>{
								// 	// 将返回的Promise实例设置为成功，值为v
								// 	resolve(v);
								// },s=>{
								// 	// 将返回的Promise实例设置为失败，值为s
								// 	reject(s);
								// })
								
								// 简化：
								value.then(resolve,reject)
							}else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
					
				}else if(this.state === "rejected"){
					// 异步调用
					setTimeout(()=>{
						try{
							// value是失败回调的返回值
							const value = onRejected(this.result);
							// value是否为Promise实例
							if(value instanceof Promise){
								// 将返回Promise设置为与value相同的结果
								value.then(resolve,reject);
							}else{
								// 返回成功promise,值为value
								resolve(value);
							}
						}catch (err){
							// 返回失败promise,值为err
							reject(err);
						}
						
					})
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    reject(2);
    // throw "异常"
})
const p2 = p1.then(value=>{
    return new Promise((resolve,reject)=>{
        // resolve(100)
        // reject(200)
        throw "异常2"
    })
    // return 1;
    // console.log("成功回调",value);
},reason=>{
    return new Promise((resolve,reject)=>{
        // resolve(100);
        // reject(2)
        throw "异常3"
    })
    // return 1;
    // console.log("失败回调",reason);
})
console.log(p2);
~~~

#### 15.11   then函数返回的Promise实例状态以及值-优化封装函数_common

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise){
								value.then(resolve,reject);
							}else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve, reject)=>{
    // resolve(1);
    reject(2);
    // throw "异常"
})
const p2 = p1.then(value=>{
    // return new Promise((resolve,reject)=>{
    // 	// resolve(100)
    // 	// reject(200)
    throw "异常2"
    // })
    // return 1;
    // console.log("成功回调",value);
},reason=>{
    // return new Promise((resolve,reject)=>{
    // 	// resolve(100);
    // 	// reject(2)
    // 	throw "异常3"
    // })
    // return 1;
    // console.log("失败回调",reason);
})
console.log(p2);
~~~

#### 15.12  增加成功与失败回调函数的默认值

~~~js
/*
 * 1- then如果省略成功回调，默认成功回调为 value=>value;
 * 2- then如果省略失败回调，默认失败回调为 reason=>{throw reason};
*/
~~~

~~~js
// 立即调用函数的好处：可以避免对外部的变量造成污染。
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
		
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise){
								value.then(resolve,reject);
							}else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve,reject)=>{
    resolve(1);
    // reject(2);
})
const p2 = p1.then();
console.log(p2);
~~~

#### 15.14   执行器函数常用于处理异步行为

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = {};
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			if(this.callbackFn.onResolved){
				this.callbackFn.onResolved();
			}
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "fulfilled";
			// 将result设置为value
			this.result = value;
			if(this.callbackFn.onRejected){
				this.callbackFn.onRejected();
			}
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn = {
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					}
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject(100);
    })
})
p1.then(value=>{
    console.log(value);
},reason=>{
    console.log("失败",reason);
})
~~~

#### 15.15  可以指定多个成功或失败的回调

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "fulfilled";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(){
		
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
// 可以指定多个成功或失败的回调
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject(100);
    })
})
p1.then(value=>{
    console.log("成功1",value);
},reason=>{
    console.log("失败1",reason);
})
p1.then(value=>{
    console.log("成功2",value);
},reason=>{
    console.log("失败2",reason);
})
p1.then(value=>{
    console.log("成功3",value);
},reason=>{
    console.log("失败3",reason);
})
p1.then(value=>{
    console.log("成功4",value);
},reason=>{
    console.log("失败4",reason);
})
~~~

#### 15.16  catch

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "fulfilled";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
// 可以指定多个成功或失败的回调
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject(100);
    })
})
// p1.then(undefined,reason=>{
// 	console.log(reason);
// })
// catch的返回值是Promise实例,实例的属性与值取决于回调函数的返回值
// 返回值为非Promise实例，那么得到的状态为成功，值为返回值
// 返回值为Promise实例，那么得到的结果与返回的结果相同。
// 有异常，那么得到的状态为失败，值为异常信息。
const p2 = p1.catch(reason=>{
    // console.log(reason);
    return new Promise((resolve,reject)=>{
        resolve(2);
    })
    // throw "异常"
})
console.log(p2);
~~~

#### 15.17  链式调用支持

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
new Promise((resolve,reject)=>{
    resolve(1);
}).then(value=>{
    console.log(value);// 1
    return 2;
}).then(value=>{
    console.log(value);// 2
    return 3;
}).then(value=>{
    console.log(value);// 3
    return 4;
}).then(value=>{
    console.log(value);// 4
    return 5;
})
~~~

#### 15.18   异常穿透支持

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
new Promise((resolve, reject) => {
    resolve(1);
}).then(value => {
    throw "异常"
}).then(value => {
    console.log(value);
    return 3;
}).then(value => {
    console.log(value);// 3
    return 4;
}).then(value => {
    console.log(value);// 4
    return 5;
}).catch(reason => {
    console.log(4,reason);
})
~~~

#### 15.19   中断Promise链

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	window.Promise = Promise;
})(window);
~~~

~~~js
new Promise((resolve,reject)=>{
    resolve(1);
}).then(value=>{
    console.log(value);// 1
    return 2;
}).then(value=>{
    console.log(value);// 2
    // 在回调函数中返回一个`pendding`状态的promise对象
    return new Promise(()=>{})
}).then(value=>{
    console.log(value);// undefined
    return 4;
}).then(value=>{
    console.log(value);// 4
    return 5;
})
~~~

#### 15.20  resolve

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	Promise.resolve = function(value){
		if(value instanceof Promise){
			return value;// 如果是Promise实例直接返回
		}else{
			// 如果不是Promise实例，那么返回的状态为成功，值为value
			return new Promise(resolve=>{
				resolve(value);
			})
		}
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
// const p1 = Promise.resolve(1);
// console.log(p1);

// const p1 = Promise.resolve(new Promise((resolve,reject)=>{
// 	resolve(2);
// }));
// console.log(p1);
//
// const p1 = Promise.resolve(new Promise((resolve,reject)=>{
// 	reject(2);
// }));
// console.log(p1);


const p =new Promise((resolve,reject)=>{
    reject(2);
})
const p1 = Promise.resolve(p);
console.log(p1===p);
~~~

#### 15.21  reject

~~~js
(function(window){
	// executor是执行器函数
	function Promise(executor){
		// 记录成功与失败回调函数
		this.callbackFn = [];
		// 定义实例属性state,初始值为pending
		this.state = "pending";
		// 定义实例属性result,初始值为undefined
		this.result = undefined;
		// 定义resolve函数
		const _resolve = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为成功(fulfilled)
			this.state = "fulfilled";
			// 成功值为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onResolved()
			})
		}
		// 定义reject函数
		const _reject = value=>{
			// 当状态已经被更改过，不允许再次更改
			if(this.state !== "pending") return;
			// 将状态更改为失败
			this.state = "rejected";
			// 将result设置为value
			this.result = value;
			this.callbackFn.forEach(item=>{
				item.onRejected()
			})
		}
		try{
			executor(_resolve,_reject);
		}catch (err){
			_reject(err);// 状态更改为失败，值为异常信息
		}
	}

	Object.assign(Promise.prototype,{
		// onResolved:成功回调
		// onRejected:失败回调
		then(onResolved,onRejected){
			// 如果成功回调不是函数，那么增加成功回调默认值
			if(!(onResolved instanceof Function)){
				onResolved = value=>value;
			}
			// 如果失败回调不是函数，那么增加失败回调默认值
			if(!(onRejected instanceof Function)){
				onRejected = reason=>{
					throw reason;
				};
			}
			return new Promise((resolve,reject)=>{
				const _common = function(callback){
					setTimeout(()=>{
						try{
							// value是成功回调的返回值
							const value = callback(this.result);
							// 判断value是不是通过Promise实例化出来的（判断value是否为Promise实例）
							if(value instanceof Promise) value.then(resolve,reject);
							else{
								// 不是Promise实例，将返回的Promise状态设置为成功，值为value
								resolve(value);
							}
						}catch (err){
							// 有异常，将返回Promise的状态更改为失败，值为err
							reject(err);
						}
						
					})
				}
				// 状态成功调用onResolved
				// p1的状态为成功
				if(this.state === "fulfilled"){
					_common.call(this,onResolved);
				}else if(this.state === "rejected"){
					_common.call(this,onRejected);
				}else{
					// pending
					// 如果状态为pending,那么保存成功与失败回调
					this.callbackFn.push({
						onResolved:_common.bind(this,onResolved),
						onRejected:_common.bind(this,onRejected)
					})
				}
			})
			
		},
		catch(onRejected){
			return this.then(undefined,onRejected)
		}
	})
	Promise.resolve = function(value){
		if(value instanceof Promise){
			return value;// 如果是Promise实例直接返回
		}else{
			// 如果不是Promise实例，那么返回的状态为成功，值为value
			return new Promise(resolve=>{
				resolve(value);
			})
		}
	}
	Promise.reject = function(value){
		return new Promise((resolve,reject)=>{
			reject(value);
		})
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = Promise.reject(1);
console.log(p1);

const p2 = Promise.reject(new Promise((resolve,reject)=>{
    resolve(2);
}));
console.log(p2);

const p3 = Promise.reject(new Promise((resolve,reject)=>{
    reject(2);
}));
console.log(p3);
~~~

#### 15.22 完成all

~~~js
(function (window) {
	// 接收执行器函数(executor)，执行器函数会同步执行（立即执行）。
	function Promise(executor) {
		this.state = "pending";// 初始状态
		this.result = undefined;// 初始值
		this.callbackFn = [];
		// _resolve函数将状态更新为成功，成功值为接收的value
		const _resolve = value => {
			// 如果状态已经更改，直接跳出函数体
			if (this.state !== "pending") return;
			this.state = "fulfilled";// 状态更新为成功
			this.result = value;// 更新成功值
			this.callbackFn.forEach(item=>{
				item.onResolved();
			})
		}
		// _reject函数将状态更新为失败，失败值为接收的value
		const _reject = value => {
			// 如果状态已经更改，直接跳出函数体
			if (this.state !== "pending") return;
			this.state = "rejected";// 状态更新为失败
			this.result = value;// 更新失败值
			this.callbackFn.forEach(item=>{
				item.onRejected();
			})
		}
		try {
			executor(_resolve, _reject);
		} catch (err) {
			// 如果有异常，将状态更新为失败，失败的值为异常信息
			_reject(err);
		}
	}
	
	// 将第二个参数（对象）合并至Promise.prototype对象中。
	Object.assign(Promise.prototype, {
		// 1- 接收成功与失败回调函数
		// 2- 返回的是一个Promise实例
		// 3- onResolved成功回调，默认值为value=>value;
		// 4- onRejected失败回调，默认值为reason=>{throw reason};
		then(onResolved, onRejected) {
			// onResolved成功回调，默认值为value=>value;
			if (!(onResolved instanceof Function)) onResolved = value => value;
			//onRejected失败回调，默认值为reason=>{throw reason};
			if (!(onRejected instanceof Function)) onRejected = reason => {
				throw reason
			};
			return new Promise((resolve, reject) => {
				// callback是成功或失败回调
				const _common = function (callback) {
					setTimeout(()=>{
						try {
							// value是成功回调返回结果
							const value = callback(this.result);
							// 判断是否为Promise实例
							if (value instanceof Promise) {
								value.then(resolve, reject);
							} else {
								// 非Promise实例
								resolve(value);
							}
						} catch (err) {
							reject(err);
						}
					})
					
				}
				// 判断状态为成功，调用成功回调
				if (this.state === "fulfilled") _common.call(this, onResolved);
				else if (this.state === "rejected") _common.call(this, onRejected);
				else {
					this.callbackFn.push({
						onResolved: _common.bind(this, onResolved),
						onRejected: _common.bind(this, onRejected)
					})
				}
			})
		},
		catch(onRejected){
			return this.then(undefined,onRejected);
		}
	})
	Promise.resolve = function(value){
		// 判断接收的参数是否为Promise实例，如果是直接返回
		if(value instanceof Promise){
			return value;
		}else{
			// 如果不是，创建一个新的Promise,状态为成功，值为value;
			return new Promise(resolve=>{
				resolve(value);
			})
		}
	}
	Promise.reject = function(value){
		// 返回失败的Promise,失败值为接收的value
		return new Promise((resolve,reject)=>{
			reject(value);
		})
	}
	// 1- 接收的是数组，返回的是Promise
	Promise.all = function(promiseArr){
		let index = 0;
		let successArr = new Array(promiseArr.length);
		return new Promise((resolve,reject)=>{
			promiseArr.forEach((value,i)=>{
				value.then(v=>{
					index++;
					successArr[i] = v;
					if(index === promiseArr.length){
						resolve(successArr);
					}
				},s=>{
					// 返回Promise的状态设置失败
					reject(s);
				})
			})
		})
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(100)
    },100)
})
const p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(200)
    },50)
})
const p3 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(300)
    },200)
})
const p4 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(400)
    },100)
})
// all接收的数组中的元素是Promise实例。
// 元素中的Promise实例都成功，p的状态为成功，值为数组，数组的元素为成功值
// 元素中有一个失败，那么p的状态为失败，值为失败值
const p = Promise.all([p1,p2,p3,p4]);
console.log(p);
~~~

#### 15.23 完成race

~~~js
(function (window) {
    // 接收执行器函数(executor)，执行器函数会同步执行（立即执行）。
    function Promise(executor) {
        this.state = "pending";// 初始状态
        this.result = undefined;// 初始值
        this.callbackFn = [];
        // _resolve函数将状态更新为成功，成功值为接收的value
        const _resolve = value => {
            // 如果状态已经更改，直接跳出函数体
            if (this.state !== "pending") return;
            this.state = "fulfilled";// 状态更新为成功
            this.result = value;// 更新成功值
            this.callbackFn.forEach(item=>{
                item.onResolved();
            })
        }
        // _reject函数将状态更新为失败，失败值为接收的value
        const _reject = value => {
            // 如果状态已经更改，直接跳出函数体
            if (this.state !== "pending") return;
            this.state = "rejected";// 状态更新为失败
            this.result = value;// 更新失败值
            this.callbackFn.forEach(item=>{
                item.onRejected();
            })
        }
        try {
            executor(_resolve, _reject);
        } catch (err) {
            // 如果有异常，将状态更新为失败，失败的值为异常信息
            _reject(err);
        }
    }

    // 将第二个参数（对象）合并至Promise.prototype对象中。
    Object.assign(Promise.prototype, {
        // 1- 接收成功与失败回调函数
        // 2- 返回的是一个Promise实例
        // 3- onResolved成功回调，默认值为value=>value;
        // 4- onRejected失败回调，默认值为reason=>{throw reason};
        then(onResolved, onRejected) {
            // onResolved成功回调，默认值为value=>value;
            if (!(onResolved instanceof Function)) onResolved = value => value;
            //onRejected失败回调，默认值为reason=>{throw reason};
            if (!(onRejected instanceof Function)) onRejected = reason => {
                throw reason
            };
            return new Promise((resolve, reject) => {
                // callback是成功或失败回调
                const _common = function (callback) {
                    setTimeout(()=>{
                        try {
                            // value是成功回调返回结果
                            const value = callback(this.result);
                            // 判断是否为Promise实例
                            if (value instanceof Promise) {
                                value.then(resolve, reject);
                            } else {
                                // 非Promise实例
                                resolve(value);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    })

                }
                // 判断状态为成功，调用成功回调
                if (this.state === "fulfilled") _common.call(this, onResolved);
                else if (this.state === "rejected") _common.call(this, onRejected);
                else {
                    this.callbackFn.push({
                        onResolved: _common.bind(this, onResolved),
                        onRejected: _common.bind(this, onRejected)
                    })
                }
            })
        },
        catch(onRejected){
            return this.then(undefined,onRejected);
        }
    })
    Promise.resolve = function(value){
        // 判断接收的参数是否为Promise实例，如果是直接返回
        if(value instanceof Promise){
            return value;
        }else{
            // 如果不是，创建一个新的Promise,状态为成功，值为value;
            return new Promise(resolve=>{
                resolve(value);
            })
        }
    }
    Promise.reject = function(value){
        // 返回失败的Promise,失败值为接收的value
        return new Promise((resolve,reject)=>{
            reject(value);
        })
    }
    // 1- 接收的是数组，返回的是Promise
    Promise.all = function(promiseArr){
        let index = 0;
        let successArr = new Array(promiseArr.length);
        return new Promise((resolve,reject)=>{
            promiseArr.forEach((value,i)=>{
                value.then(v=>{
                    index++;
                    successArr[i] = v;
                    if(index === promiseArr.length){
                        resolve(successArr);
                    }
                },s=>{
                    // 返回Promise的状态设置失败
                    reject(s);
                })
            })
        })
    }
    Promise.race = function(promiseArr){
        return new Promise((resolve,reject)=>{
            promiseArr.forEach(value=>{
                // value.then(v=>{
                // 	resolve(v);
                // },s=>{
                // 	reject(s);
                // })
                value.then(resolve,reject);
            })
        })
    }
    window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(100)
    },100)
})
const p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject(200)
    },50)
})
const p3 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(300)
    },200)
})
const p4 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(400)
    },100)
})
// race:返回的是Promise实例，谁先执行完就与谁的状态以及值相同。
const p = Promise.race([p1,p2,p3,p4]);
console.log(p);
~~~

#### 15.24 class版本实现Promise

~~~js
(function (window) {
	// 1-将之前构造函数体内的语句放置到constructor函数中
	// 2-将之前prototype的属性直接放置到Promise中
	class Promise{
		static resolve(value){
			// 判断接收的参数是否为Promise实例，如果是直接返回
			if(value instanceof Promise){
				return value;
			}else{
				// 如果不是，创建一个新的Promise,状态为成功，值为value;
				return new Promise(resolve=>{
					resolve(value);
				})
			}
		}
		static reject(value){
			// 返回失败的Promise,失败值为接收的value
			return new Promise((resolve,reject)=>{
				reject(value);
			})
		}
		static all(promiseArr){
			let index = 0;
			let successArr = new Array(promiseArr.length);
			return new Promise((resolve,reject)=>{
				promiseArr.forEach((value,i)=>{
					value.then(v=>{
						index++;
						successArr[i] = v;
						if(index === promiseArr.length){
							resolve(successArr);
						}
					},s=>{
						// 返回Promise的状态设置失败
						reject(s);
					})
				})
			})
		}
		static race(promiseArr){
			return new Promise((resolve,reject)=>{
				promiseArr.forEach(value=>{
					// value.then(v=>{
					// 	resolve(v);
					// },s=>{
					// 	reject(s);
					// })
					value.then(resolve,reject);
				})
			})
		}
		constructor(executor) {
			this.state = "pending";// 初始状态
			this.result = undefined;// 初始值
			this.callbackFn = [];
			// _resolve函数将状态更新为成功，成功值为接收的value
			const _resolve = value => {
				// 如果状态已经更改，直接跳出函数体
				if (this.state !== "pending") return;
				this.state = "fulfilled";// 状态更新为成功
				this.result = value;// 更新成功值
				this.callbackFn.forEach(item=>{
					item.onResolved();
				})
			}
			// _reject函数将状态更新为失败，失败值为接收的value
			const _reject = value => {
				// 如果状态已经更改，直接跳出函数体
				if (this.state !== "pending") return;
				this.state = "rejected";// 状态更新为失败
				this.result = value;// 更新失败值
				this.callbackFn.forEach(item=>{
					item.onRejected();
				})
			}
			try {
				executor(_resolve, _reject);
			} catch (err) {
				// 如果有异常，将状态更新为失败，失败的值为异常信息
				_reject(err);
			}
		}
		then(onResolved, onRejected) {
			// onResolved成功回调，默认值为value=>value;
			if (!(onResolved instanceof Function)) onResolved = value => value;
			//onRejected失败回调，默认值为reason=>{throw reason};
			if (!(onRejected instanceof Function)) onRejected = reason => {
				throw reason
			};
			return new Promise((resolve, reject) => {
				// callback是成功或失败回调
				const _common = function (callback) {
					setTimeout(()=>{
						try {
							// value是成功回调返回结果
							const value = callback(this.result);
							// 判断是否为Promise实例
							if (value instanceof Promise) {
								value.then(resolve, reject);
							} else {
								// 非Promise实例
								resolve(value);
							}
						} catch (err) {
							reject(err);
						}
					})
					
				}
				// 判断状态为成功，调用成功回调
				if (this.state === "fulfilled") _common.call(this, onResolved);
				else if (this.state === "rejected") _common.call(this, onRejected);
				else {
					this.callbackFn.push({
						onResolved: _common.bind(this, onResolved),
						onRejected: _common.bind(this, onRejected)
					})
				}
			})
		}
		catch(onRejected){
			return this.then(undefined,onRejected);
		}
	}
	window.Promise = Promise;
})(window);
~~~

~~~js
const p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(100)
    },100)
})
const p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject(200)
    },50)
})
const p3 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(300)
    },200)
})
const p4 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(400)
    },100)
})
// race:返回的是Promise实例，谁先执行完就与谁的状态以及值相同。
const p = Promise.race([p1,p2,p3,p4]);
console.log(p);
~~~

