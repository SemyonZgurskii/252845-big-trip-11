import API from "./api.js";
import Board from "./components/board.js";
import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter-controller.js";
import IfnoComponent from "./components/info.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import PriceComponent from "./components/price.js";
import RouteComponent from "./components/route.js";
import StatistcsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic oeu30202asoeu21a22`;
const eventsModel = new EventsModel();
const api = new API(AUTHORIZATION);


const mainElement = document.querySelector(`.page-body__page-main`)
  .querySelector(`.page-body__container`);
const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);

const board = new Board();
render(mainElement, board, RenderPosition.BEFOREEND);

const tripController = new TripController(board, eventsModel, api);
render(mainHeaderElement, new IfnoComponent(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(infoElement, new RouteComponent(), RenderPosition.BEFOREEND);

const menuComponent = new MenuComponent();
render(mainControlsElement, menuComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(mainControlsElement, eventsModel);
filterController.render();

const statisticsComponent = new StatistcsComponent();
render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

mainHeaderElement.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    statisticsComponent.hide();
    tripController.show();
    tripController.createEvent();
  });

menuComponent.setOnItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
  }
});

api.getEvents()
  .then((trueEvents) => {
    eventsModel.setEvents(trueEvents);
    tripController.renderEvents();
    render(infoElement, new PriceComponent(trueEvents), RenderPosition.BEFOREEND);
  });
