import AbstractComponent from "./abstract-component";
import {getMonthDate} from "../utils/common.js";

const calculatePeriod = (events) => {
  const start = getMonthDate(events[0].start);
  const end = getMonthDate(events[events.length - 1].end);

  return `${start} &nbsp;&mdash;&nbsp; ${end}`;
};

const getRoute = (events) => {
  const startPoint = events[0].destination.name;
  const middlePoint = events[Math.round(events.length / 2)].destination.name;
  const endPoint = events[events.length - 1].destination.name;
  let routeText = ``;

  switch (events.length) {
    case 0:
      routeText = ``;
      break;
    case 1:
      routeText = `${startPoint}`;
      break;
    case 2:
      routeText = `${startPoint}  &mdash; ${endPoint}`;
      break;
    case 3:
      routeText = `${startPoint}  &mdash; ${middlePoint} &mdash; ${endPoint}`;
      break;
    default:
      routeText = `${startPoint}  &mdash; ... &mdash; ${endPoint}`;
      break;
  }

  return routeText;
};

const createRouteTemplate = (events) => {
  if (!events) {
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
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createRouteTemplate(this._events);
  }
}
