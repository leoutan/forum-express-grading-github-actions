// const adminController = {
//   getRestaurants : (req, res) => {
//     return res.render('admin/restaurants')
//   }
// }

// module.exports = adminController
// const { raw } = require('express')
const { Restaurant, User } = require('../models')
// const restaurant = require('../models/restaurant')
const localFileHandler = require('../helpers/file-helpers')
const { tr } = require('faker/lib/locales')

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
  },
  getUsers: async (req, res) => {
    const users = await User.findAll({ raw: true })
    return res.render('admin/users', { users })
  },
  patchUser: async (req, res, next) => {
    let user = await User.findByPk(req.params.id)
    if (!user) {
      req.flash('error_messages', '用戶不存在')
      return res.redirect('back')
    }
    if (user.isAdmin === true && user.email === 'root@example.com') {
      req.flash('error_messages', '禁止變更 root 權限')
      return res.redirect('back')
    }
    user = await user.update({ isAdmin: !user.isAdmin })
    req.flash('success_messages', '使用者權限變更成功')
    res.redirect('/admin/users')
  }
}

module.exports = adminController
