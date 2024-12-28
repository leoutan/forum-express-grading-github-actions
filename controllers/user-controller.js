const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const body = req.body
    bcrypt.hash(body.password, 10)
      .then(hash => {
        return User.create({
          name: body.name,
          email: body.email,
          password: hash
        })
      })
      .then(() => {
        res.redirect('/signin')
      })
  }
}

module.exports = userController