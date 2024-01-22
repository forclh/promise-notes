// 1. 导入fs模块
const fs = require('fs');
// 2. 实例化Promise
new Promise((resolve, reject) => {
    fs.readFile('./resource/1.txt', (err, data) => {
        if (err) reject(err);
        resolve(data);
    });
}).then(value => {
    return new Promise((resolve, reject) => {
        fs.readFile('./resource/2.txt', (err, data) => {
            if (err) reject(err);
            resolve([value, data]);
        });
    })
}).then(value => {
    return new Promise((resolve, reject) => {
        fs.readFile('./resource/3.txt', (err, data) => {
            if (err) reject(err);
            value.push(data);
            resolve(value);
        })
    })
}).then(value => {
    console.log(value); // buffer
    console.log(value.toString());
})