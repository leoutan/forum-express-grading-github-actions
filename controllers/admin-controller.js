// const adminController = {
//   getRestaurants : (req, res) => {
//     return res.render('admin/restaurants')
//   }
// }

// module.exports = adminController
// const { raw } = require('express')
const { Restaurant } = require('../models')
// const restaurant = require('../models/restaurant')
const localFileHandler = require('../helpers/file-helpers')

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
    const { file } = req
    localFileHandler(file).then(filepath => {
      return Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filepath || null
      })
    })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant do not exist')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant do not exist')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('name is required')
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filepath]) => {
        if (!restaurant) throw new Error('restaurant do not exist')
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filepath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', '更新成功')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant do not exist')
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', '刪除成功')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
