import {castTimeFormat} from "../utils/common.js";
import {MonthNumberToString} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const generateCounterMarkup = (counter) => {
  return counter ? `<span class="day__counter">${counter}</span>` : ``;
};

const generateTimeMarkup = (event) => {
  if (!event) {
    return ``;
  }

  const eventDate = event.start;
  const dateTime = eventDate.getFullYear() + `-` + eventDate.getMonth() + `-` + eventDate.getDate();
  const month = MonthNumberToString[eventDate.getMonth()];
  const date = castTimeFormat(eventDate.getDate());

  return `<time class="day__date" datetime="${dateTime}">${month}  ${date}</time>`;
};


const createDayTemplate = (event, counter) => {
  return (
    `<li class="trip-days__item  day">
    <div class="day__info">
      ${generateCounterMarkup(counter)}
      ${generateTimeMarkup(event)}
    </div>

    <ul class="trip-events__list"></ul>
  </li>`
  );
};


export default class Day extends AbstractComponent {
  constructor(event, counter) {
    super();

    this._event = event;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._event, this._counter);
  }
}
