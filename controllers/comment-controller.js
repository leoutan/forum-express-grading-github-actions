const { Comment, Restaurant, User } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        if (!user) throw new Error("User didn't exist!!!")
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => {
        res.redirect(`/restaurants/${restaurantId}`)
      })
  },
  deleteComment: (req, res, next) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error('Comment didn\'t exist!')
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      .catch(error => next(error))
  }
}

module.exports = commentController