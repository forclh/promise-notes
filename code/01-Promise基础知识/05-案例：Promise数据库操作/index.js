// 1.导入mongoose
const mongoose = require('mongoose');
// 2. 实例化Promise
new Promise((resolve, reject) => {
  // 3. 连接数据库
  mongoose.connect('mongodb://127.0.0.1/promise');
  mongoose.connection.on('open', () => {
    // 连接成功的情况
    resolve();
  });
  mongoose.connection.on('error', () => {
    // 连接失败的情况
    reject();
  });
}).then(value => {
  // 创建结构
  const noteSchema = new mongoose.Schema({
    title: String,
    content: String
  });

  // 创建模型
  const noteModel = mongoose.model('notes', noteSchema);

  // 读取操作
  // find()函数返回promise对象
  noteModel.find().then(value => {
    console.log(value);
  }, reason => {
    console.log(reason);
  })
}, reason => {
  console.log('连接数据库失败');
})