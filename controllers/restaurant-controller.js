// const restaurantController = {
//   getRestaurants: (req, res) => {
//     return res.render('restaurants')
//   }
// }

// module.exports = restaurantController
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { Op } = require('sequelize')

const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    Restaurant.count({ // 先查詢出滿足條件的筆數
      where: {
        ...categoryId ? { categoryId } : {}
      }
    }).then(amount => { // 判斷 query string 的 page 是否超過最大頁數，避免使用者直接在網址輸入超過最大頁數的值
      const totalPage = Math.ceil(amount / limit)
      page = page > totalPage ? totalPage : page
      const offset = getOffset(limit, page)
      return offset
    })
      .then(offset => {
        return Promise.all([
          Restaurant.findAndCountAll({
            include: Category,
            nest: true,
            where: {
              ...(categoryId ? { categoryId } : {})
            },
            limit,
            offset,
            raw: true
          }),
          Category.findAll({ raw: true })
        ])
      })
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        })
        )
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User } // 當我要從餐廳關聯到評論，再從這些評論關聯到使用者才需要這樣寫。如果沒有要使用者的話這行可以整個拿掉，放Comment就好。
      ],
      order: [[{ model: Comment }, 'createdAt', 'DESC']],
      nest: true
    })
      .then(restaurant => {
        console.log('rest: ', restaurant.toJSON())
        if (!restaurant) throw new Error('restaurant didn\'t exist')
        return restaurant.increment('viewCounts')
      })
      .then(incrementResult => {
        res.render('restaurant', { restaurant: incrementResult.toJSON() })
      })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        const commentAmount = restaurant.Comments.length
        res.render('dashboard', { restaurant, commentAmount })
      })
  }
}

module.exports = restaurantController
