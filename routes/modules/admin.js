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

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)

router.put('/restaurants/:id', adminController.putRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})

module.exports = router
