import DaysContainerComponent from "../components/days-container.js";
import DayComponent from "../components/day.js";
import SortComponent, {SortType} from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import PointController, {Mode as PointControllerMode, EmptyEvent} from "../controllers/point-controller.js";
import {render, RenderPosition} from "../utils/render.js";
import {getDuration} from "../utils/common.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];

  switch (sortType) {
    case SortType.TIME_UP:
      sortedEvents = events.slice().sort((a, b) => getDuration(b) - getDuration(a));
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

export default class TripControler {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._pointControllers = [];
    this._creatingEvent = null;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainerComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const daysContainerElement = this._daysContainerComponent.getElement();
    this._creatingEvent = new PointController(daysContainerElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.renderEvent(EmptyEvent, PointControllerMode.ADDING);
  }

  renderEvents() {
    const container = this._container;
    const events = this._eventsModel.getEvents();

    if (this._eventsModel.getAllEvents().length < 1) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    events.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysContainerComponent, RenderPosition.BEFOREEND);

    this.renderDays();
  }

  renderDays() {
    const events = this._eventsModel.getEvents();

    const days = Array.from(new Set(events.map(({start}) => start.getDate())),
        (date) => events.filter((event) => event.start.getDate() === date));

    days.forEach((day, i) => {
      render(this._daysContainerComponent.getElement(), new DayComponent(day[0], i + 1), RenderPosition.BEFOREEND);
    });

    const daysElements = this._daysContainerComponent.getElement().querySelectorAll(`.trip-events__list`);
    daysElements.forEach((dayElement, i) => {
      days[i].forEach((event) => {
        const newEvent = new PointController(dayElement, this._onDataChange, this._onViewChange);
        this._pointControllers.push(newEvent);
        newEvent.renderEvent(event, PointControllerMode.DEFAULT);
      });
    });
  }

  _onSortTypeChange(sortType) {
    const daysContainerElement = this._daysContainerComponent.getElement();

    daysContainerElement.innerHTML = ``;

    if (sortType === SortType.DEFAULT) {
      this.renderDays();
    } else {
      const sortEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
      render(daysContainerElement, new DayComponent(), RenderPosition.BEFOREEND);
      const eventsContainer = daysContainerElement.querySelector(`.trip-events__list`);
      sortEvents.forEach((event) => {
        const newEvent = new PointController(eventsContainer, this._onDataChange, this._onViewChange);
        this._pointControllers.push(newEvent);
        newEvent.renderEvent(event, PointControllerMode.DEFAULT);
      });
    }
  }

  _updateEvents() {
    this._removeEvents();
    this.renderEvents();
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
        this._updateEvents();
      } else {
        this._eventsModel.addEvent(newData);
        // pointController.renderEvent(newData, PointControllerMode.DEFAULT);
        pointController.destroy();
        this._updateEvents();
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        // pointController.renderEvent(newData, PointControllerMode.DEFAULT);
        pointController.destroy();
        this._updateEvents();
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
  }
}
