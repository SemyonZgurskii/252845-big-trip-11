const getFormatTime = (date) => {
  return date.getHours() + `:` + date.getMinutes();
};

const getFormatDateTime = (date) => {
  const year = date.getYear();
  const month = date.getMonth();
  const day = date.getDate();

  return year + `-` + month + `-` + day + `T` + getFormatTime(date);
};

export {getFormatTime, getFormatDateTime};
