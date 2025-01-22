// const adminController = {
//   getRestaurants : (req, res) => {
//     return res.render('admin/restaurants')
//   }
// }

// module.exports = adminController
// const { raw } = require('express')
const { Restaurant, User, Category } = require('../models')
// const restaurant = require('../models/restaurant')
const localFileHandler = require('../helpers/file-helpers')
const { tr } = require('faker/lib/locales')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Restaurant.findAndCountAll({
      raw: true,
      limit,
      offset,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        res.render('admin/restaurants', {
          restaurants: restaurants.rows,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(error => next(error))
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('name is required')
    const { file } = req
    localFileHandler(file).then(filepath => {
      return Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filepath || null,
        categoryId
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
    Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findByPk(req.params.id, {
        raw: true
      })
    ])
      .then(([categories, restaurant]) => {
        if (!restaurant) throw new Error('restaurant do not exist')
        res.render('admin/edit-restaurant', { categories, restaurant })
      })
      .catch(error => next(error))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
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
          image: filepath || restaurant.image,
          categoryId
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
  },
  getCategories: (req, res) => {
    Category.findAll({ raw: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
  }
}

module.exports = adminController
