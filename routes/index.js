// 總路由

const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth-handler')

const admin = require('./modules/admin')
const passport = require('../config/passport')

router.use('/admin', authenticatedAdmin, admin) // 以.use而非.get才能將任何method的admin請求都導向到admin
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/', (req, res) => {
  return res.redirect('/restaurants')
})
router.use('/', generalErrorHandler) // 引用 error-handler 接收傳過來的 error

module.exports = router
