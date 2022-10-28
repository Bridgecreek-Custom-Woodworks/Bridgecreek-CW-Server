'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ProductCare',
      [
        {
          productId: '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f',
          maintenance:
            'Wash by hand with soap and water after each use, and let it air dry. Never leave it soaking in water, or put it in the dishwasher.\n\nIf your board has any sour or mold-like smell, you can also put a cup of baking powder onto the board and pour a cup of white vinegar over the board. The combination of these two ingredients will create an oxidization process that will remove stains and (hopefully) any lingering smells left in your cutting board. For a more natural route, you can also cut lemons in half and rub the board down with the sides of the lemon. Let sit for a few minutes before rinsing off.\n\nThree or four times a year, oil with food-grade mineral oil, any butcher block conditioner or Totally Bored conditioner. With care, your board can become a treasured heirloom.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          productId: '2c7e9ccd-a521-4505-b03f-1ff24614fad7',
          maintenance:
            'Wash by hand with soap and water after each use, and let it air dry. Never leave it soaking in water, or put it in the dishwasher.\n\nIf your board has any sour or mold-like smell, you can also put a cup of baking powder onto the board and pour a cup of white vinegar over the board. The combination of these two ingredients will create an oxidization process that will remove stains and (hopefully) any lingering smells left in your cutting board. For a more natural route, you can also cut lemons in half and rub the board down with the sides of the lemon. Let sit for a few minutes before rinsing off.\n\nThree or four times a year, oil with food-grade mineral oil, any butcher block conditioner or Totally Bored conditioner. With care, your board can become a treasured heirloom.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          productId: '33cf392c-087e-4143-858c-9e00c7c6a119',
          maintenance:
            'Wash by hand with soap and water after each use, and let it air dry. Never leave it soaking in water, or put it in the dishwasher.\n\nIf your board has any sour or mold-like smell, you can also put a cup of baking powder onto the board and pour a cup of white vinegar over the board. The combination of these two ingredients will create an oxidization process that will remove stains and (hopefully) any lingering smells left in your cutting board. For a more natural route, you can also cut lemons in half and rub the board down with the sides of the lemon. Let sit for a few minutes before rinsing off.\n\nThree or four times a year, oil with food-grade mineral oil, any butcher block conditioner or Totally Bored conditioner. With care, your board can become a treasured heirloom.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          productId: '68c70732-98ff-40cc-86ce-04ceef2eb623',
          maintenance:
            'Wash by hand with soap and water after each use, and let it air dry. Never leave it soaking in water, or put it in the dishwasher.\n\nIf your board has any sour or mold-like smell, you can also put a cup of baking powder onto the board and pour a cup of white vinegar over the board. The combination of these two ingredients will create an oxidization process that will remove stains and (hopefully) any lingering smells left in your cutting board. For a more natural route, you can also cut lemons in half and rub the board down with the sides of the lemon. Let sit for a few minutes before rinsing off.\n\nThree or four times a year, oil with food-grade mineral oil, any butcher block conditioner or Totally Bored conditioner. With care, your board can become a treasured heirloom.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   productId: '700b2eb1-3de0-4d9d-a0b7-a9d48c67f1ac',
        //   maintenance:
        //     'Wash by hand with soap and water after each use, and let it air dry. Never leave it soaking in water, or put it in the dishwasher.\n\nIf your board has any sour or mold-like smell, you can also put a cup of baking powder onto the board and pour a cup of white vinegar over the board. The combination of these two ingredients will create an oxidization process that will remove stains and (hopefully) any lingering smells left in your cutting board. For a more natural route, you can also cut lemons in half and rub the board down with the sides of the lemon. Let sit for a few minutes before rinsing off.\n\nThree or four times a year, oil with food-grade mineral oil, any butcher block conditioner or Totally Bored conditioner. With care, your board can become a treasured heirloom.',
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCare', null, {});
  },
};
