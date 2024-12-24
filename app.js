const express = require('express')
const routes = require('./routes')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('.hbs', engine({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
