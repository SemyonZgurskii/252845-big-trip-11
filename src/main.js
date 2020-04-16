import DaysContainerComponent from "./components/days-container.js";
import DayComponent from "./components/day.js";
import IfnoComponent from "./components/info.js";
import RouteComponent from "./components/route.js";
import PriceComponent from "./components/price.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createEventTemplate} from "./components/event.js";
import {generateEvents} from "./mocks/event.js";
import {newRender, RenderPosition} from "./utils.js";

const EVENTS_COUNT = 20;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.start.getTime() - b.start.getTime());

const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);
const mainContentElement = document.querySelector(`.trip-events`);

newRender(mainHeaderElement, new IfnoComponent().getElement(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

newRender(infoElement, new RouteComponent().getElement(), RenderPosition.BEFOREEND);
newRender(infoElement, new PriceComponent(events).getElement(), RenderPosition.BEFOREEND);
newRender(mainControlsElement, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
newRender(mainControlsElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
newRender(mainContentElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
newRender(mainContentElement, new DaysContainerComponent().getElement(), RenderPosition.BEFOREEND);

const daysContainerElement = mainContentElement.querySelector(`.trip-days`);

const days = Array.from(new Set(events.map(({start}) => start.getDate())),
    (date) => events.filter((event) => event.start.getDate() === date));

days.forEach((day, i) => {
  newRender(daysContainerElement, new DayComponent(day[0], i + 1).getElement(), RenderPosition.BEFOREEND);
});

const daysElements = daysContainerElement.querySelectorAll(`.trip-events__list`);
daysElements.forEach((dayElement, i) => {
  days[i].forEach((event) => render(dayElement, createEventTemplate(event)));
});


const eventsContainerElement = daysContainerElement.querySelector(`.trip-events__list`);
render(eventsContainerElement, createEventEditTemplate(events[0]), `afterbegin`);
