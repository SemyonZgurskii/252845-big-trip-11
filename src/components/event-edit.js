import {EVENT_TYPES, CITIES} from "../const.js";
import {getMarkupFromArray, getRandomBoolean, getFormatTime, getFormatDate} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const generateEventTypeElement = (eventType) => {
  return (
    `<div class="event__type-item">
    <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
  </div>`
  );
};

const generateCitiesElement = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const generateOptionsElement = (option) => {
  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.title}-1" type="checkbox" name="event-offer-${option.title}" ${getRandomBoolean() ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${option.title}-1">
      <span class="event__offer-title">${option.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
    </label>
  </div>`
  );
};

const generatePhotosElement = (photo) => {
  return `<img class="event__photo" src="${photo}" alt="Event photo">`;
};

const createEventEditTemplate = (event) => {
  const {city, info, price, options, start, end} = event;
  const transferTypesMarkup = getMarkupFromArray(EVENT_TYPES.transfer, generateEventTypeElement);
  const activityTypesMarkup = getMarkupFromArray(EVENT_TYPES.activity, generateEventTypeElement);
  const citiesMarkup = getMarkupFromArray(CITIES, generateCitiesElement);
  const optionsMarkup = getMarkupFromArray(options, generateOptionsElement);
  const photosMarkup = getMarkupFromArray(info.photos, generatePhotosElement);

  const startTime = getFormatDate(start, `/`) + ` ` + getFormatTime(start);
  const endTime = getFormatDate(end, `/`) + ` ` + getFormatTime(end);
  const description = info.description;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            ${transferTypesMarkup}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            ${activityTypesMarkup}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          Flight to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${citiesMarkup}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${optionsMarkup}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosMarkup}
          </div>
        </div>
      </section>
    </section>
  </form>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
