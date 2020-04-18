import DaysContainerComponent from "../components/days-container.js";
import DayComponent from "../components/day.js";
import SortComponent from "../components/sort.js";
import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import NoEventsComponent from "../components/no-events.js";
import {render, RenderPosition} from "../utils/render.js";

const renderEvent = (dayElement, event) => {
  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event);

  const replaceEventToEdit = () => {
    dayElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    dayElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setEditButtonHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setSubmitHandler(() => {
    replaceEditToEvent();
  });

  render(dayElement, eventComponent, RenderPosition.BEFOREEND);
};

export default class TripControler {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysContainerComponent = new DaysContainerComponent();
    this._dayComponent = new DayComponent();
  }

  renderDays() {
    const container = this._container;
    const events = this._events;

    if (events.length < 1) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }
    events.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

    render(container, new SortComponent(), RenderPosition.BEFOREEND);
    render(container, new DaysContainerComponent(), RenderPosition.BEFOREEND);

    const daysContainerElement = container.querySelector(`.trip-days`);

    const days = Array.from(new Set(events.map(({start}) => start.getDate())),
        (date) => events.filter((event) => event.start.getDate() === date));

    days.forEach((day, i) => {
      render(daysContainerElement, new DayComponent(day[0], i + 1), RenderPosition.BEFOREEND);
    });

    const daysElements = daysContainerElement.querySelectorAll(`.trip-events__list`);
    daysElements.forEach((dayElement, i) => {
      days[i].forEach((event) => renderEvent(dayElement, event));
    });
  }
}
