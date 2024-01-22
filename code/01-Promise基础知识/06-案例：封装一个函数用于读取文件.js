// 1/ 导入模块
const fs = require('fs');
// 2. 封装函数
function readFileFun(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
// 3. 调用
readFileFun('./resource/1.txt').then(value => {
    console.log(value.toString());
}, reason => {
    console.log(reason);
})