import {castTimeFormat, createElement} from "../utils.js";
import {MonthNumberToString} from "../const.js";

const createDayTemplate = (event, counter) => {
  const eventDate = event.start;
  const dateTime = eventDate.getFullYear() + `-` + eventDate.getMonth() + `-` + eventDate.getDate();
  const month = MonthNumberToString[eventDate.getMonth()];
  const date = castTimeFormat(eventDate.getDate());

  return (
    `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${counter}</span>
      <time class="day__date" datetime="${dateTime}">${month}  ${date}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>`
  );
};

export default class Day {
  constructor(event, counter) {
    this._event = event;
    this._counter = counter;

    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._event, this._counter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
