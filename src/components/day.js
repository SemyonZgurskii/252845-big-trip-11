import {castTimeFormat} from "../utils.js";
import {MonthNumberToString} from "../const.js";
import AbstractComponent from "./abstract-component.js";

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
