import DaysContainerComponent from "../components/days-container.js";
import DayComponent from "../components/day.js";
import SortComponent, {SortType} from "../components/sort.js";
import NoEventsComponent from "../components/no-events.js";
import PointController from "../controllers/point-controller.js";
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

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainerComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  _updateEvents() {
    // this._removeEvents();
    // this._renderEvents(this._eventsModel.getEvents());
    console.log(`lol`);
  }

  renderEvents() {
    const container = this._container;
    const events = this._eventsModel.getEvents();

    if (events.length < 1) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    events.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysContainerComponent, RenderPosition.BEFOREEND);

    const daysContainerElement = container.querySelector(`.trip-days`);

    const days = Array.from(new Set(events.map(({start}) => start.getDate())),
        (date) => events.filter((event) => event.start.getDate() === date));

    const renderDays = () => {
      days.forEach((day, i) => {
        render(daysContainerElement, new DayComponent(day[0], i + 1), RenderPosition.BEFOREEND);
      });

      const daysElements = daysContainerElement.querySelectorAll(`.trip-events__list`);
      daysElements.forEach((dayElement, i) => {
        days[i].forEach((event) => {
          const newEvent = new PointController(dayElement, this._onDataChange, this._onViewChange);
          this._pointControllers.push(newEvent);
          newEvent.renderEvent(event);
        });
      });
    };

    renderDays();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      daysContainerElement.innerHTML = ``;

      if (sortType === SortType.DEFAULT) {
        renderDays();
      } else {
        const sortEvents = getSortedEvents(events, sortType);
        render(daysContainerElement, new DayComponent(), RenderPosition.BEFOREEND);
        const eventsContainer = daysContainerElement.querySelector(`.trip-events__list`);
        sortEvents.forEach((event) => {
          const newEvent = new PointController(eventsContainer, this._onDataChange, this._onViewChange);
          this._pointControllers.push(newEvent);
          newEvent.renderEvent(event);
        });
      }
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      pointController.renderEvent(newData);
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => pointController.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
  }
}
