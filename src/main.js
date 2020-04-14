import {createDaysContainerTemplate} from "./components/days-container.js";
import {createDayTemplate} from "./components/day.js";
import {createInfoTemplate} from "./components/info.js";
import {createRouteTemplate} from "./components/route.js";
import {createPriceTemplate} from "./components/price.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortElement} from "./components/sort.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createEventTemplate} from "./components/event.js";
import {generateEvents} from "./mocks/event.js";

const EVENTS_COUNT = 20;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.start.getTime() - b.start.getTime());

const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);
const mainContentElement = document.querySelector(`.trip-events`);

render(mainHeaderElement, createInfoTemplate(), `afterbegin`);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(infoElement, createRouteTemplate());
render(infoElement, createPriceTemplate());
render(mainControlsElement, createMenuTemplate());
render(mainControlsElement, createFilterTemplate());
render(mainContentElement, createSortElement());
render(mainContentElement, createDaysContainerTemplate());

const daysContainerElement = mainContentElement.querySelector(`.trip-days`);

const daysDates = Array.from(new Set(events.map(({start}) => start.getDate())));
const days = daysDates.map((it) => events.filter((event) => event.start.getDate() === it));


days.forEach((it, i) => {
  render(daysContainerElement, createDayTemplate(it[0], i + 1));
});

const daysElements = daysContainerElement.querySelectorAll(`.trip-events__list`);
daysElements.forEach((it, i) => {
  days[i].forEach((event) => render(it, createEventTemplate(event)));
});

const eventsContainerElement = daysContainerElement.querySelector(`.trip-events__list`);
render(eventsContainerElement, createEventEditTemplate(events[0]), `afterbegin`);
