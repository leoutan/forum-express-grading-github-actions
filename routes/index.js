// 總路由

const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin) // 以use而非get才能將任何method的admin請求都導向到admin
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => {
  return res.redirect('/restaurants')
})

module.exports = router
