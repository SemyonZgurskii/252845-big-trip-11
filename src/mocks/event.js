import {EVENT_TYPES, CITIES} from "../const.js";
import {getRandomBoolean} from "../utils/common.js";

const MAX_PRICE = 10000;
const MIN_PHOTOS = 1;
const MAX_PHOTOS = 5;
const MIN_SENTENCES = 1;
const MAX_SENTENCES = 5;
const MAX_TIME_GAP = 1000 * 60 * 60 * 29;

const options = [
  {
    title: `Add luggage`,
    price: 30,
  }, {
    title: `Switch to comfort class`,
    price: 100,
  }, {
    title: `Add meal`,
    price: 15,
  }, {
    title: `Choose seats`,
    price: 5,
  }, {
    title: `Travel by train`,
    price: 40,
  }
];

const descriptionSource = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomNumber = (min, max) => {
  const number = min + Math.floor(Math.random() * max);
  return number;
};

const getRandomLengthArray = (min, max) => {
  return new Array(getRandomNumber(min, max))
    .fill(``);
};

const getRandomArraysElement = (array) => {
  return array[getRandomNumber(0, array.length)];
};

const separateTextToSentnces = (text) => {
  return text.split(`. `);
};

const generateRandomType = () => {
  const typeCategory = getRandomBoolean ? EVENT_TYPES.activity : EVENT_TYPES.transfer;
  return getRandomArraysElement(typeCategory);
};

const generateDescription = () => {
  const basicTextPieces = separateTextToSentnces(descriptionSource);
  return getRandomLengthArray(MIN_SENTENCES, MAX_SENTENCES)
    .map(() => getRandomArraysElement(basicTextPieces));
};

const generateRandomPhoto = () => {
  return `http://picsum.photos/248/152?r=${Math.random()}`;
};

const generatePhotosSrc = () => {
  return getRandomLengthArray(MIN_PHOTOS, MAX_PHOTOS)
    .map(() => generateRandomPhoto());
};

const generateOptions = () => {
  return options
    .filter(() => getRandomBoolean())
    .sort(() => getRandomBoolean() ? 1 : -1);
};

const generateTimeGap = () => {
  return Math.floor(Math.random() * MAX_TIME_GAP);
};

const generateRandomDate = () => {
  const date = new Date();
  const timeGap = generateTimeGap();
  const sign = getRandomBoolean() ? 1 : -1;
  date.setTime(date.getTime() + sign * timeGap);
  return date;
};

const generateEvent = (startDate, endDate) => {
  return {
    type: generateRandomType(),
    city: getRandomArraysElement(CITIES),
    options: generateOptions(),
    info: {
      description: generateDescription(),
      photos: generatePhotosSrc(),
    },
    price: Math.floor(Math.random() * MAX_PRICE),
    start: startDate,
    end: endDate,
  };
};

const generateEvents = (eventQuantity) => {
  const events = [];
  let date = generateRandomDate();
  while (events.length < eventQuantity) {
    const start = new Date();
    start.setTime(date.getTime());
    date.setTime(date.getTime() + generateTimeGap());
    const end = new Date();
    end.setTime(date.getTime());
    date.setTime(date.getTime() + generateTimeGap());
    events.push(generateEvent(start, end));
  }
  return events;
};

export {generateEvents};
