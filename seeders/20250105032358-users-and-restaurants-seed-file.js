'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const axios = require('axios')
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

      const categories = await queryInterface.sequelize.query(
        'SELECT id FROM Categories;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      const photoList = await Promise.all(
        Array.from({ length: 50 }).map(() => {
          return axios.get('https://loremflickr.com/json/g/320/240/restaurants,food/all')
            .then(response => {
              return response.data.rawFileUrl
            })
            .catch(error => {
              console.error('error fetching photo', error)
              return null
            })
        })
      ).then(photos => {
        return photos.filter(photo => photo)
      })

      if (photoList.length < 50) throw new Error('not enough photos')
      for (let i = 0; i < 50; i++) {
        const response = await axios.get('https://loremflickr.com/json/g/320/240/restaurants,food/all')
        // console.log('response: ', response)
        photoList.push(response.data.rawFileUrl)
      }
      console.log('photoList: ', photoList)

      await queryInterface.bulkInsert('Restaurants',
        Array.from({ length: 50 }, (_, index) => {
          return {
            name: faker.name.findName(),
            tel: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            opening_hours: '08:00',
            image: photoList[index],
            description: faker.lorem.text(),
            created_at: new Date(),
            updated_at: new Date(),
            category_id: categories[Math.floor(Math.random() * categories.length)].id
          }
        }), { transaction }
      )
      await transaction.commit()
    } catch (error) {
      if (transaction) return transaction.rollback()
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('USers', {})
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
