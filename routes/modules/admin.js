// const express = require('express')
// const router = express.Router()

// const adminController = require('../../controllers/admin-controller')

// router.get('/restaurants', adminController.getRestaurants)
// router.use('/', (req, res) => {
//   return res.redirect('/admin/restaurants')
// })

// module.exports = router

const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

router.get('/restaurants/create', adminController.createRestaurant)

router.post('/restaurants', adminController.postRestaurant)

router.get('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})

module.exports = router
