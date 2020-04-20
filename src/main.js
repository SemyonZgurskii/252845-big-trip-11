import TripController from "./controllers/trip-controller.js";
import IfnoComponent from "./components/info.js";
import RouteComponent from "./components/route.js";
import PriceComponent from "./components/price.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import {generateEvents} from "./mocks/event.js";
import {render, RenderPosition} from "./utils/render.js";

const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT);

const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);

const mainContentElement = document.querySelector(`.trip-events`);


render(mainHeaderElement, new IfnoComponent(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(infoElement, new RouteComponent(), RenderPosition.BEFOREEND);
render(infoElement, new PriceComponent(events), RenderPosition.BEFOREEND);
render(mainControlsElement, new MenuComponent(), RenderPosition.BEFOREEND);
render(mainControlsElement, new FilterComponent(), RenderPosition.BEFOREEND);

const tripController = new TripController(mainContentElement, events);
tripController.renderEvents();
