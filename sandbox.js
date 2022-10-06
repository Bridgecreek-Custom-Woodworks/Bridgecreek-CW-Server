const { v4: uuidv4 } = require('uuid');

// Generate uuid for seeders
let uuid1 = uuidv4();
let uuid2 = uuidv4();
let uuid3 = uuidv4();

// console.log(uuid1, uuid2, uuid3);

// How generate next day
const date = new Date();
console.log(date);

const addOneDay = date.setDate(date.getDate() + 1);
console.log(addOneDay);

const nextDay = new Date(addOneDay);
console.log(nextDay);

// Verify date is greater than now
console.log(nextDay > Date.now());
