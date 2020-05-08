import AbstractSmartComponent from "./abstract-smart-component.js";
import EventModel from "../models/event.js";
import {EVENT_TYPES} from "../const.js";
import {getMarkupFromArray, getFormatTime, getFormatDate, makeFirstLetterUppercase} from "../utils/common.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const generateEventTypeElement = (eventType) => {
  const eventTypeTitle = makeFirstLetterUppercase(eventType);

  return (
    `<div class="event__type-item">
    <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventTypeTitle}</label>
  </div>`
  );
};

const generateCitiesElement = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const generateOptionMarkup = (option, isChecked) => {
  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.title}-1" type="checkbox" name="event-offer-${option.title}" ${isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${option.title}-1">
      <span class="event__offer-title">${option.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
    </label>
  </div>`
  );
};

const generateOptionsElement = (activeOptions = [], allOptions) => {
  if (!allOptions) {
    return ``;
  }
  const optionsMarkup = [];
  allOptions.forEach((option) => {
    const isChecked = activeOptions.some(({title}) => option.title === title);
    optionsMarkup.push(generateOptionMarkup(option, isChecked));
  });

  return (
    `<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${optionsMarkup}
      </div>
    </section>`
  );
};

const generatePhotoMarkup = (picture) => {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
};

const generatePhotosElement = (pictures) => {
  if (!pictures) {
    return ``;
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${getMarkupFromArray(pictures, generatePhotoMarkup)}
      </div>
    </div>`
  );
};

const generateDescriptionElement = (description) => {
  if (!description) {
    return ``;
  }

  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

const generateInfoElement = (destination) => {
  if (!destination) {
    return ``;
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${generateDescriptionElement(destination.description)}
      ${generatePhotosElement(destination.pictures)}
    </section>`
  );
};

const createEventEditTemplate = (event, destinations, offers) => {
  const {type, destination, price, options: activeOptions, start, end, isFavorite} = event;
  const city = destination ? destination.name : ``;
  const cities = destinations.map(({name}) => name);
  const allOptions = offers.get(type);
  const transferTypesMarkup = getMarkupFromArray(EVENT_TYPES.transfer, generateEventTypeElement);
  const activityTypesMarkup = getMarkupFromArray(EVENT_TYPES.activity, generateEventTypeElement);
  const citiesMarkup = getMarkupFromArray(cities, generateCitiesElement);
  const optionsMarkup = city ? generateOptionsElement(activeOptions, allOptions) : ``;
  const infoMarkup = generateInfoElement(destination);
  const typePlaceHolder = makeFirstLetterUppercase(type);
  const typeArticle = EVENT_TYPES.transfer.indexOf(type) > 0 ? `to` : `at`;

  const startTime = getFormatDate(start, `/`) + ` ` + getFormatTime(start);
  const endTime = getFormatDate(end, `/`) + ` ` + getFormatTime(end);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
          ${typePlaceHolder} ${typeArticle}
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
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>
      
    </header>

    ${optionsMarkup}

    ${infoMarkup}
      
    </section>
  </form>`
  );
};

const parseFormData = (formData) => {
  const startDate = formData.get(`event-start-time`);
  const endDate = formData.get(`event-end-time`);

  return {
    "destination": {
      "name": formData.get(`event-destination`),
    },
    "base_price": parseInt(formData.get(`event-price`), 10),
    "date_from": new Date(startDate).toISOString(),
    "date_to": new Date(endDate).toISOString(),
    "is_favorite": formData.get(`event-favorite`) ? true : false,
  };
};
export default class EventEdit extends AbstractSmartComponent {
  constructor(event, destinations, offers) {
    super();

    this._event = event;
    this._destinations = destinations;
    this._offers = offers;

    this._isPriceValid = true;
    this._isDestinationValid = true;

    this._flatpickr = null;
    this._submitHandler = null;
    this._favoriteHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._validateForm();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._destinations, this._offers);
  }

  isValid() {
    return this._isPriceValid && this._isDestinationValid;
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);

    const offers = Array.from(form.querySelectorAll(`.event__offer-selector`),
        (offer) => {
          return {
            title: offer.querySelector(`.event__offer-title`).textContent,
            price: parseInt(offer.querySelector(`.event__offer-price`).textContent, 10),
          };
        });

    const type = form.querySelector(`.event__type-icon`)
        .src
        .split(`/`)
        .pop()
        .split(`.`)[0];

    const description = form.querySelector(`.event__destination-description`)
        .textContent;

    const pictures = Array.from(form.querySelectorAll(`.event__photo`),
        (photo) => {
          return {
            "src": photo.src,
            "description": photo.alt,
          };
        });

    const newData = Object.assign(parseFormData(formData), {
      offers,
      type,
    });

    newData.destination.description = description;
    newData.destination.pictures = pictures;

    return EventModel.parseEvent(newData);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteHandler(this._favoriteHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._validateForm();
    this._subscribeOnEvents();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setFavoriteHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);

    this._favoriteHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-wrapper`)
      .addEventListener(`change`, (evt) => {
        if (!evt.target.classList.contains(`event__type-input`)) {
          return;
        }

        const selectedType = evt.target.value;
        this._event = Object.assign({}, this._event, {
          type: selectedType,
        });
        this.rerender();
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        if (this._isDestinationValid) {
          const newDestination = this._destinations.find((destination) => destination.name === evt.target.value);
          this._event = Object.assign({}, this._event, {
            destination: newDestination,
          });
          this.rerender();
        } else {
          return;
        }
      });
  }

  _validateForm() {
    const form = this.getElement();
    const priceInput = form.querySelector(`.event__input--price`);
    const destinationInput = form.querySelector(`.event__input--destination`);

    priceInput.addEventListener(`input`, () => {
      priceInput.setCustomValidity(``);
      if (!isFinite(priceInput.value)) {
        priceInput.setCustomValidity(`The value must be a number`);
        this._isPriceValid = false;
      } else {
        this._isPriceValid = true;
      }
    });

    destinationInput.addEventListener(`input`, () => {
      destinationInput.setCustomValidity(``);
      const isMatch = this._destinations
        .some(({name}) => name === destinationInput.value);
      if (!isMatch) {
        destinationInput.setCustomValidity(`You should select one of available destinons`);
        this._isDestinationValid = false;
      } else {
        this._isDestinationValid = true;
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);

    this._flatpickr = flatpickr(startDateElement, {
      altInput: true,
      altFormat: `y/m/d H:i`,
      enableTime: true,
      allowInput: true,
      defaultDate: this._event.start,
    });

    this._flatpickr = flatpickr(endDateElement, {
      altInput: true,
      enableTime: true,
      altFormat: `y/m/d H:i`,
      allowInput: true,
      defaultDate: this._event.end,
    });
  }
}
