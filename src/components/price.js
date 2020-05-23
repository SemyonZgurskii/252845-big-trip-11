import AbstractComponent from "./abstract-component";

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

export default class Price extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createPriceTemplate(this._events);
  }
}
