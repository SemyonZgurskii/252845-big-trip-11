import DaysContainerComponent from "./components/days-container.js";
import DayComponent from "./components/day.js";
import IfnoComponent from "./components/info.js";
import RouteComponent from "./components/route.js";
import PriceComponent from "./components/price.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import EventEditComponent from "./components/event-edit.js";
import EventComponent from "./components/event.js";
import {generateEvents} from "./mocks/event.js";
import {render, RenderPosition} from "./utils.js";

const renderEvent = (dayElement, event) => {
  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event);

  const replaceEventToEdit = () => {
    dayElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    dayElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
  });

  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, () => {
    replaceEditToEvent();
  });

  render(dayElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT).sort((a, b) => a.start.getTime() - b.start.getTime());

const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);
const mainContentElement = document.querySelector(`.trip-events`);

render(mainHeaderElement, new IfnoComponent().getElement(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(infoElement, new RouteComponent().getElement(), RenderPosition.BEFOREEND);
render(infoElement, new PriceComponent(events).getElement(), RenderPosition.BEFOREEND);
render(mainControlsElement, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
render(mainControlsElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
render(mainContentElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(mainContentElement, new DaysContainerComponent().getElement(), RenderPosition.BEFOREEND);

const daysContainerElement = mainContentElement.querySelector(`.trip-days`);

const days = Array.from(new Set(events.map(({start}) => start.getDate())),
    (date) => events.filter((event) => event.start.getDate() === date));

days.forEach((day, i) => {
  render(daysContainerElement, new DayComponent(day[0], i + 1).getElement(), RenderPosition.BEFOREEND);
});

const daysElements = daysContainerElement.querySelectorAll(`.trip-events__list`);
daysElements.forEach((dayElement, i) => {
  days[i].forEach((event) => renderEvent(dayElement, event));
});
