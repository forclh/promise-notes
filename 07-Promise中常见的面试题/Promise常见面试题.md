### 十四、Promise常见面试题

~~~js
setTimeout(() => {
    console.log(1)
}, 0)
Promise.resolve().then(() => {
    console.log(2)
})
Promise.resolve().then(() => {
    console.log(4)
})
console.log(3)
~~~

~~~js
setTimeout(() => {
    console.log(1)
}, 0)
new Promise((resolve) => {
    console.log(2)
    resolve()
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(4)
})
console.log(5)
~~~

~~~js
const first = () => (new Promise((resolve, reject) => {
    console.log(3)
    let p = new Promise((resolve, reject) => {
        console.log(7)
        setTimeout(() => {
            console.log(5)
            resolve(6)
        }, 0)
        resolve(1)
    })
    resolve(2)
    p.then((arg) => {
        console.log(arg)
    })

}))
first().then((arg) => {
    console.log(arg)
})
console.log(4)
~~~

~~~js
setTimeout(() => {
    console.log("0")
}, 0)
new Promise((resolve, reject) => {
    console.log("1")
    resolve()
}).then(() => {
    console.log("2")
    new Promise((resolve, reject) => {
        console.log("3")
        resolve()
    }).then(() => {
        console.log("4")
    }).then(() => {
        console.log("5")
    })
}).then(() => {
    console.log("6");
})

new Promise((resolve, reject) => {
    console.log("7")
    resolve()
}).then(() => {
    console.log("8")
});
~~~

### 