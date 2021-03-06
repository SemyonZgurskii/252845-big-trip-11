import DaysContainerComponent from "../components/days-container.js";
import DayComponent from "../components/day.js";
import SortComponent, {SortType} from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import PointController, {Mode as PointControllerMode, EmptyEvent} from "../controllers/point-controller.js";
import {render, RenderPosition} from "../utils/render.js";
import {getDuration} from "../utils/common.js";

const getEventsByDates = (events) => {
  return Array.from(new Set(events.map(({start}) => start.getDate())),
      (date) => events.filter((event) => event.start.getDate() === date));
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  switch (sortType) {
    case SortType.TIME_UP:
      sortedEvents = events.slice().sort((a, b) => getDuration(b.start, b.end) - getDuration(a.start, a.end));
      break;
    case SortType.PRICE_UP:
      sortedEvents = events.slice().sort((a, b) => b.price - a.price);
      break;
    case SortType.DEFAULT:
      sortedEvents = events;
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container, eventsModel, destinationsModel, optionsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._optionsModel = optionsModel;
    this._api = api;

    this._pointControllers = [];
    this._creatingEvent = null;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainerComponent();

    this._onEventRemove = null;
    this._onEventCreate = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  hide() {
    this._container.hide();
    this._sortComponent.setDefaultSortHandler(this._onSortTypeChange);
  }

  show() {
    this._container.show();
  }

  setEventRemoveHandler(handler) {
    this._onEventRemove = handler;
  }

  setEventCreateHandler(handler) {
    this._onEventCreate = handler;
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._onViewChange();
    this._onEventCreate();
    this._sortComponent.setDefaultSortHandler(this._onSortTypeChange);

    const destinations = this._destinationsModel.getDestinations();
    const options = this._optionsModel.getOptions();

    const daysContainerElement = this._daysContainerComponent.getElement();
    this._creatingEvent = new PointController(daysContainerElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.renderEvent(EmptyEvent, destinations, options, PointControllerMode.ADDING);
  }

  render() {
    const container = this._container.getElement();

    if (this._eventsModel.getAllEvents().length < 1) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysContainerComponent, RenderPosition.BEFOREEND);

    const eventsListContainer = this._daysContainerComponent.getElement();
    this._renderSortedEvents(eventsListContainer, this._sortComponent.getCurrentSortType());
  }

  renderEventsByDays() {
    const events = this._eventsModel.getEvents();
    const eventsByDates = getEventsByDates(events);

    eventsByDates.forEach((day, i) => {
      render(this._daysContainerComponent.getElement(), new DayComponent(day[0], i + 1), RenderPosition.BEFOREEND);
    });

    const daysElements = this._daysContainerComponent.getElement().querySelectorAll(`.trip-events__list`);

    daysElements.forEach((dayElement, i) => {
      this._renderEvents(dayElement, eventsByDates[i]);
    });
  }

  _onSortTypeChange(sortType) {
    const daysContainerElement = this._daysContainerComponent.getElement();

    daysContainerElement.innerHTML = ``;

    this._renderSortedEvents(daysContainerElement, sortType);
  }

  _updateEvents() {
    this._removeEvents();
    this.render();
  }

  _renderEvents(container, events) {
    const destinations = this._destinationsModel.getDestinations();
    const options = this._optionsModel.getOptions();

    events.forEach((event) => {
      const newEvent = new PointController(container, this._onDataChange, this._onViewChange);
      this._pointControllers.push(newEvent);
      newEvent.renderEvent(event, destinations, options, PointControllerMode.DEFAULT);
    });
  }

  _renderSortedEvents(daysContainer, sortType) {
    if (sortType === SortType.DEFAULT) {
      this.renderEventsByDays();
    } else {
      const sortEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
      render(daysContainer, new DayComponent(), RenderPosition.BEFOREEND);
      const eventsContainer = daysContainer.querySelector(`.trip-events__list`);
      this._renderEvents(eventsContainer, sortEvents);
    }
  }

  _removeEvents() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._daysContainerComponent.getElement()
      .querySelectorAll(`.trip-days__item`)
      .forEach((day) => day.remove());
    this._pointControllers = [];
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._onEventRemove();
        this._updateEvents();
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            pointController.destroy();
            this._updateEvents();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((updatedEvent) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, updatedEvent);

          if (isSuccess) {
            pointController.destroy();
            this._updateEvents();
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
  }
}
