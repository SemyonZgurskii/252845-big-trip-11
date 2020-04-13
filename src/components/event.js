import {getFormatTime, getFormatDateTime} from "../utils.js";

const generateOptionMarkup = (title, price) => {
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
      .map(({title, price}) => generateOptionMarkup(title, price))
      .join(`\n`);
  }
  return ``;
};

// Менее часа: минуты (например «23M»);
// Менее суток: часы минуты (например «02H 44M»);
// Более суток: дни часы минуты (например «01D 02H 30M»);

const getDuration = (start, end) => {
  const minutes = Math.floor((end.getTime() - start.getTime()) / 1000);
  const hours = Math.floor(minutes / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return days + `D ` + hours + `H ` + minutes + `M`;
  } else if (hours >= 1) {
    return hours + `H ` + minutes + `M`;
  }
  return minutes + `M`;
};

export const createEventTemplate = (event) => {
  const {type, city, start, end, price, options} = event;

  // const type = `Taxi`;
  // const city = `San Francisko`;
  // const startDateTime = `2019-03-18T10:30`;
  // const startTime = `10:30`;
  // const endDateTime = `2019-03-18T11:00`;
  // const endTime = `11:00`;
  // const duration = `30M`;
  // const price = `20`;
  const offersMarkup = generateOptionsMarkup(options);

  const startDateTime = getFormatDateTime(start);
  const startTime = getFormatTime(start);
  const endDateTime = getFormatDateTime(end);
  const endTime = getFormatTime(end);
  const duration = getDuration(start, end);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} to ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
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
