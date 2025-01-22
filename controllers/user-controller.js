const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const localFileHandler = require('../helpers/file-helpers')
const { raw } = require('express')

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
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      console.log('req.params.id:', req.params.id)
      const user = await User.findByPk(req.params.id, {
        // include: {
        //   model: Comment, include: Restaurant
        // },
        // raw: true
      })
      console.log('Found user:', user)
      if (!user) throw new Error('User didn\'t exist!')
      // user = user.toJSON()
      return res.render('users/profile', { user: user.toJSON() })
    } catch (error) {
      console.error('Error:', error)
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('user didn\'t exist!')
      res.render('users/edit', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const userId = req.user.id
    console.log('file: ', file)
    try {
      const [filepath, user] = await Promise.all([
        localFileHandler(file),
        User.findByPk(req.params.id)
      ])
      if (!user) throw new Error('user didn\'t exist!')
      if (user.id !== userId) throw new Error('You can only edit your profile')
      await user.update({
        name,
        image: filepath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${userId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController