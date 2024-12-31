const fs = require('fs')
const { resolve } = require('path')

const localFileHandler = file => {
  console.log(file)
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    // 複製檔案到 upload 資料夾
    const fileName = `upload/${file.originalname}` // 產生目的地路徑
    console.log('file.path: ', file.path)
    return fs.promises.readFile(file.path) // 讀取檔案
      .then(data => fs.promises.writeFile(fileName, data)) // 將資料寫入 upload 資料夾
      .then(() => resolve(`/${fileName}`))
      .catch(error => reject(error))
  })
}
module.exports = localFileHandler