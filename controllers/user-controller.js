const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 表單驗證
    const body = req.body
    if (body.password !== body.passwordCheck) throw new Error('password do not match')

    User.findOne({ where: { email: body.email } })
      .then(user => {
        if (user) throw new Error('email already exists')
        return bcrypt.hash(body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: body.name,
          email: body.email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      })
      .catch(error => next(error)) // 錯誤處理，往下傳送到下一個 middleware，即 error-handler
  }
}

module.exports = userController