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

const getDuration = (event) => {
  const start = event.start;
  const end = event.end;
  return end.getTime() - start.getTime();
};

const getFormatDuration = (duration) => {
  const durationInMinutes = duration / (1000 * 60);
  const days = Math.floor(durationInMinutes / (60 * 24));
  const hours = Math.floor((durationInMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(((durationInMinutes % (60 * 24)) % 60));

  if (days > 0) {
    return days + `D ` + hours + `H ` + minutes + `M`;
  } else if (hours >= 1) {
    return hours + `H ` + minutes + `M`;
  }
  return minutes + `M`;
};


export {castTimeFormat, getFormatTime, getFormatDate, getRandomBoolean, getMarkupFromArray, getDuration, getFormatDuration};
