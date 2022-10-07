const { v4: uuidv4 } = require('uuid');

// Generate uuid for seeders
let uuid1 = uuidv4();
let uuid2 = uuidv4();
let uuid3 = uuidv4();

// console.log(uuid1, uuid2, uuid3);

// How generate next day
const date = new Date();
// console.log(date);

const addOneDay = date.setDate(date.getDate() + 1);
// console.log(addOneDay);

const nextDay = new Date(addOneDay);
// console.log(nextDay);

// Verify date is greater than now
// console.log(nextDay > Date.now());

let word = 'pricelte';

// let match = word.match(/\w(gt|gte|lt|lte)\w/);
let match = word.match(/(lte|gte|lt|gt)/);
console.log(match);
// let newWord = word.replace(match[0], '');
// let newWord = word.replace(/\w(gt|lt)\w/, '');

// console.log(newWord);

if (match) {
  let newWord = word.replace(match[0], '');
  console.log(newWord);
}

// if (word.includes('gte')) {
//   let lastIndex = word.indexOf('gte');
//   console.log(word.slice(0, lastIndex));
//   return word.slice(0, lastIndex);
// } else if (word.includes('lte')) {
//   let lastIndex = word.indexOf('lte');
//   console.log(word.slice(0, lastIndex));
//   return word.slice(0, lastIndex);
// }

// console.log(word.includes(/[lte]/));
