const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

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

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  const fragment = document.createDocumentFragment();

  newElement.innerHTML = template;
  newElement.childNodes.forEach((node) => fragment.appendChild(node));

  return fragment;
};

const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {castTimeFormat, getFormatTime, getFormatDate, getRandomBoolean, getMarkupFromArray, createElement, render, RenderPosition};
