import AbstractComponent from "./abstract-component";
import {getMonthDate} from "../utils/common.js";

const calculatePeriod = (events) => {
  const start = getMonthDate(events[0].start);
  const end = getMonthDate(events[events.length - 1].end);

  return `${start} &nbsp;&mdash;&nbsp; ${end}`;
};

const getRoute = (events) => {
  const startPoint = events[0].destination.name;
  const middlePoint = events[events.length / 2].destination.name;
  const endPoint = events[events.length - 1].destination.name;

  return `${startPoint}  &mdash; ${middlePoint} &mdash; ${endPoint}`;
};

const createRouteTemplate = (events) => {
  if (!events || events.length < 2) {
    return ``;
  }

  const period = calculatePeriod(events);
  const route = getRoute(events);

  return (
    `<div class="trip-info__main">
    <h1 class="trip-info__title">${route}</h1>

    <p class="trip-info__dates">${period}</p>
  </div>`
  );
};

export default class Route extends AbstractComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
  }

  getTemplate() {
    return createRouteTemplate(this._eventsModel.getAllEvents());
  }
}
