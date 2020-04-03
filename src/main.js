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

const EVENTS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

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

render(daysContainerElement, createDayTemplate());

const eventsContainerElement = daysContainerElement.querySelector(`.trip-events__list`);

render(eventsContainerElement, createEventEditTemplate());

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventsContainerElement, createEventTemplate());
}
