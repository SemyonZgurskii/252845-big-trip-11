const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const getFormatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return hours + `:` + minutes;
};

const getFormatDate = (date, separator) => {
  const year = date.getFullYear().toString().slice(2);
  const month = castTimeFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());

  return year + separator + month + separator + day;
};

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

const getMarkupFromArray = (array, elementCreator) => {
  return array.map((it) => elementCreator(it))
    .join(`\n`);
};

export {castTimeFormat, getFormatTime, getFormatDate, getRandomBoolean, getMarkupFromArray};
