'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Reviews',
      [
        {
          reviewId: '18f47f53-94f6-4974-9a00-9f9dfbfbaa08',
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          comments:
            'I love this cutting board! Its such a beautiful that I prefer to leave it out all the time!!',
          rating: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          reviewId: 'd92842b8-f6ba-4b18-983e-2245e43c96e0',
          userId: '1024cf0f-9c88-4af3-8eb3-928a0a0b844e',
          productId: '33cf392c-087e-4143-858c-9e00c7c6a119',
          comments:
            'This wine rack has been a topic at several of my gatherings! It goes to well with my kitchen and my the cutting board that I also purchased here! ',
          rating: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          reviewId: 'dba35cf9-3ad2-4ac4-b4d4-566ba679360e',
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          comments:
            'Its a nice cutting board but its a little to big for my drawer so I have to leave it out. That is really my only complaint',
          rating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 'e30dc6f5-4123-4af5-8467-883c89591705',
          userId: '15242016-6385-4ef3-9c9a-0ec1bf595515',
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          comments:
            'I like the coasters a lot more than I thought I would. They go really well with my living room furniture and coffee table.',
          rating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: '95dea332-8f0b-4977-b060-9728cfbaa5af',
          userId: 'aa1b2829-6807-4d6e-b6bd-f5debeb93577',
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          comments:
            'I was not impressed with the coasters. I will not buy from here ever again.',
          rating: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {
        individualHooks: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
