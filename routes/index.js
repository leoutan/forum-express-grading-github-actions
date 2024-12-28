// 總路由

const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middlewares/error-handler')

const admin = require('./modules/admin')

router.use('/admin', admin) // 以.use而非.get才能將任何method的admin請求都導向到admin
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => {
  return res.redirect('/restaurants')
})
router.use('/', generalErrorHandler) // 引用 error-handler 接收傳過來的 error

module.exports = router
