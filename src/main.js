import API from "./api/api.js";
import Board from "./components/board.js";
import DestinationsModel from "./models/destinations.js";
import EventsModel from "./models/events.js";
import HeaderController from "./controllers/header-controller.js";
import InfoComponent from "./components/info.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import NewEventButton from "./components/new-event-button";
import OptionsModel from "./models/options.js";
import Provider from "./api/provider.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store";
import TripController from "./controllers/trip-controller.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic oeu302aeee1122a22`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const optionsModel = new OptionsModel();
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainElement = document.querySelector(`.page-body__page-main`)
  .querySelector(`.page-body__container`);
const mainHeaderElement = document.querySelector(`.trip-main`);
const mainControlsElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);

const board = new Board();
const tripController = new TripController(board, eventsModel, destinationsModel, optionsModel, apiWithProvider);
const menuComponent = new MenuComponent();

render(mainElement, board, RenderPosition.BEFOREEND);
render(mainHeaderElement, new InfoComponent(), RenderPosition.AFTERBEGIN);

render(mainControlsElement, menuComponent, RenderPosition.BEFOREEND);

const headerController = new HeaderController(mainHeaderElement, eventsModel);

const statisticsComponent = new StatisticsComponent(eventsModel);
render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

const newEventBtn = new NewEventButton();
render(mainHeaderElement, newEventBtn, RenderPosition.BEFOREEND);

newEventBtn.setButtonClickHandler(() => {
  statisticsComponent.hide();
  menuComponent.setDefault();
  tripController.show();
  tripController.createEvent();
});

tripController.setEventRemoveHandler(() => {
  newEventBtn.enable();
});

tripController.setEventCreateHandler(() => {
  headerController.resetFilter();
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

board.loadingStatusOn();

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOptions(),
  apiWithProvider.getEvents()
]).then((results) => {
  const [destinations, options, events] = results;
  board.loadingStatusOff();

  destinationsModel.setDestinations(destinations);
  optionsModel.setOptions(options);
  eventsModel.setEvents(events);

  headerController.render();
  tripController.render();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
