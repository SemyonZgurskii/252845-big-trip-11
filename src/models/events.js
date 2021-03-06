import {getFilteredEvents} from "../utils/filter";
import {getByDateEvents} from "../utils/common";
import {FilterType} from "../const.js";

export default class Events {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getEvents() {
    return getFilteredEvents(this._events, this._activeFilterType);
  }

  getAllEvents() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._events = getByDateEvents(this._events);
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
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
