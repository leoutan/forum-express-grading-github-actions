const { reset } = require('nodemon')
const { Restaurant, Category } = require('../models')
const { Op } = require('sequelize')


const categoryController = {
  getCategories: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }), // 用於分類清單
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null // 如果請求中有包含 id 代表要編輯，那就先用 id 查詢資料表，用於將分類名稱顯示於輸入框
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(error => next(error))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.create({ name })
      .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('name is required')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('category do not exist!')
        return category.update({ name })
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  },
  deleteCategory: async (req, res, next) => {
    // 查詢該分類關聯的餐廳、查詢該分類
    Promise.all([
      Restaurant.findAll({ where: { categoryId: { [Op.eq]: req.params.id } } }),
      Category.findByPk(req.params.id)
    ])
      .then(([restaurants, category]) => {
        if (!category) throw new Error('Category didn\'t exist!')
        if (restaurants.length > 0) {
          return Restaurant.update({ categoryId: 1 }, {
            where: { categoryId: category.id }
          }).then(() => category)
        }
        return category
      })
      .then(category => {
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '成功')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  }
}

module.exports = categoryController