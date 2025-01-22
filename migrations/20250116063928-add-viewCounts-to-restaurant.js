'use strict'

const { query } = require("express")
const { toDefaultValue } = require("sequelize/lib/utils")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('restaurants', 'view_counts', {})
  }
}
