import moment from "moment";

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

const getDuration = (start, end) => {
  return moment.duration(moment(end).diff(moment(start)));
};

const getFormatDuration = (duration) => {
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (days) {
    return days + `D ` + hours + `H ` + minutes + `M`;
  } else if (hours) {
    return hours + `H ` + minutes + `M `;
  } else {
    return minutes + `M`;
  }
};

const makeFirstLetterUppercase = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};


export {
  castTimeFormat,
  getFormatTime,
  getFormatDate,
  getRandomBoolean,
  getMarkupFromArray,
  getDuration,
  getFormatDuration,
  makeFirstLetterUppercase
};
