// const adminController = {
//   getRestaurants : (req, res) => {
//     return res.render('admin/restaurants')
//   }
// }

// module.exports = adminController
// const { raw } = require('express')
const { Restaurant } = require('../models')
// const restaurant = require('../models/restaurant')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(error => next(error))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('name is required')
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
