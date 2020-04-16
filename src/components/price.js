import {createElement} from "../utils.js";

const getOverallPrice = (events) => {
  return events.reduce((summ, event) => {
    const optionsPrice = event.options.reduce((acc, option) => acc + option.price, 0);
    return summ + event.price + optionsPrice;
  }, 0);
};

const createPriceTemplate = (events) => {
  return (
    `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getOverallPrice(events)}</span>
  </p>`
  );
};

export default class Price {
  constructor(events) {
    this._events = events;

    this._element = null;
  }

  getTemplate() {
    return createPriceTemplate(this._events);
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
