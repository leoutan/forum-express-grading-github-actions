// 總路由

const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')

router.use('/admin', admin) // 以use而非get才能將任何method的admin請求都導向到admin
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => {
  return res.redirect('/restaurants')
})

module.exports = router
