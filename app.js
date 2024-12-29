const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const session = require('express-session')
const flash = require('connect-flash')
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const currentYear = require('./helpers/handlebars-helpers')

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('.hbs', handlebars({ extname: '.hbs', helpers: currentYear }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  // res.locals.currentYear = currentYear()
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
