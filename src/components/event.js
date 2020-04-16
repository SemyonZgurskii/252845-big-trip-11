import {getFormatTime, getFormatDate, createElement} from "../utils.js";

const generateOptionsElement = (title, price) => {
  return (
    `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
   </li>`
  );
};

const generateOptionsMarkup = (options) => {
  if (options.length > 0) {
    return options
      .map(({title, price}) => generateOptionsElement(title, price))
      .join(`\n`);
  }
  return ``;
};

const getDuration = (start, end) => {
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  const days = Math.floor(duration / (60 * 24));
  const hours = Math.floor((duration % (60 * 24)) / 60);
  const minutes = Math.floor(((duration % (60 * 24)) % 60));

  if (days > 0) {
    return days + `D ` + hours + `H ` + minutes + `M`;
  } else if (hours >= 1) {
    return hours + `H ` + minutes + `M`;
  }
  return minutes + `M`;
};

const createEventTemplate = (event) => {
  const {type, city, start, end, price, options} = event;

  const offersMarkup = generateOptionsMarkup(options);

  const startDateTime = getFormatDate(start, `-`);
  const startTime = getFormatTime(start);
  const endDateTime = getFormatDate(end, `-`);
  const endTime = getFormatTime(end);
  const duration = getDuration(start, end);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} to ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateTime + `T` + startTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDateTime + `T` + endTime}">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class Event {
  constructor(event) {
    this._event = event;

    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      return createElement(this.getTemplate());
    }

    return this._element();
  }

  removeElement() {
    this._element = null;
  }
}
