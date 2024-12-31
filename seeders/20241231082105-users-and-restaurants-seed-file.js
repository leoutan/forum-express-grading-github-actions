'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()
      await queryInterface.bulkInsert('Users', [{
        name: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      }], { transaction })
      await queryInterface.bulkInsert('Restaurants',
        Array.from({ length: 50 }, () => {
          return {
            name: faker.name.findName(),
            tel: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            opening_hours: '08:00',
            image: `https://loremflickr.com/320/240/restaurant,food?random=${Math.ceil(Math.random() * 100)}`,
            description: faker.lorem.text(),
            created_at: new Date(),
            updated_at: new Date()
          }
        }), { transaction }
      )
      await transaction.commit()
    } catch (error) {
      if (transaction) return transaction.rollback()
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
