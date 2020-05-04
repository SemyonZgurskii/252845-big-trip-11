import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter-controller.js";
import IfnoComponent from "./components/info.js";
import MenuComponent from "./components/menu.js";
import PriceComponent from "./components/price.js";
import RouteComponent from "./components/route.js";
import StatistcsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import {generateEvents} from "./mocks/event.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const mainElement = document.querySelector(`.page-body__page-main`);
const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);

const mainContentElement = document.querySelector(`.trip-events`);


render(mainHeaderElement, new IfnoComponent(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(infoElement, new RouteComponent(), RenderPosition.BEFOREEND);
render(infoElement, new PriceComponent(events), RenderPosition.BEFOREEND);

const menuComponent = new MenuComponent();
render(mainControlsElement, menuComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(mainControlsElement, eventsModel);
filterController.render();

const tripController = new TripController(mainContentElement, eventsModel);
tripController.renderEvents();

const statisticsComponent = new StatistcsComponent();
render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);

mainHeaderElement.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    statisticsComponent.hide();
    tripController.show();
    tripController.createEvent();
  });

menuComponent.setOnItemClickHandler(console.log);