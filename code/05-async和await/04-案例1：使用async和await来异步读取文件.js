// 导入模块
const fs = require('fs');
const { promisify } = require('util');

// async封装函数
async function myReadFile() {
    let readFile = promisify(fs.readFile);
    try {
        let one = await readFile('./resource/1.txt');
        let two = await readFile('./resource/2.txt');
        let three = await readFile('./resource/3.txt');
        console.log(one + two + three);
    } catch (e) {
        console.log(e);
    }
}

// 调用函数
myReadFile();