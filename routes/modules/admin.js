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
const upload = require('../../middlewares/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)

router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.get('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})

module.exports = router
