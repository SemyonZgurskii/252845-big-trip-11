import {getFilteredEvents} from "../utils/filter";
import {FilterType} from "../const.js";

export default class Events {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
    this._dataChangeHandler = null;
  }

  getEvents() {
    return getFilteredEvents(this._events, this._activeFilterType);
  }

  getAllEvents() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._dataChangeHandler();

    return true;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._dataChangeHandler();

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._dataChangeHandler();
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandler = handler;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
