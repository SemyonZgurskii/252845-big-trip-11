import API from "./api/index.js";
import Board from "./components/board.js";
import DestinationsModel from "./models/destinations.js";
import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter-controller.js";
import IfnoComponent from "./components/info.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import OptionsModel from "./models/all-options.js";
import PriceComponent from "./components/price.js";
import Provider from "./api/provider.js";
import RouteComponent from "./components/route.js";
import StatistcsComponent from "./components/statistics.js";
import Store from "./api/store";
import TripController from "./controllers/trip-controller.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic oeu30202asoeu21a22`;
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
render(mainHeaderElement, new IfnoComponent(), RenderPosition.AFTERBEGIN);

const infoElement = mainHeaderElement.querySelector(`.trip-main__trip-info`);

render(mainControlsElement, menuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(mainControlsElement, eventsModel);
filterController.render();

const statisticsComponent = new StatistcsComponent(eventsModel);
render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

mainHeaderElement.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    statisticsComponent.hide();
    menuComponent.setDefault();
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

Promise.all([
  apiWithProvider.getDestinations()
    .then((destinations) => {
      destinationsModel.setDestinations(destinations);
    }),
  apiWithProvider.getOptions()
    .then((offers) => {
      optionsModel.setOptions(offers);
    }),
]).then(() => {
  apiWithProvider.getEvents()
    .then((trueEvents) => {
      eventsModel.setEvents(trueEvents);
      tripController.renderEvents();
      render(infoElement, new RouteComponent(eventsModel), RenderPosition.BEFOREEND);
      render(infoElement, new PriceComponent(eventsModel), RenderPosition.BEFOREEND);
    });
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
  // .then(() => {
  //   console.log(`успешно зарегистрирован`);
  // }).catch(() => {
  // // Действие, в случае ошибки при регистрации ServiceWorker
  // });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
