import {getFilteredEvents} from "../utils/filter";
import {FilterType} from "../const.js";

export default class Events {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChnageHandlers = [];
    this._filterChangeHandlers = [];
  }

  getEvents() {
    // debugger;
    return getFilteredEvents(this._events, this._activeFilterType);
  }

  setEvents(events) {
    this._events = Array.from(events);
    // this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._dataChnageHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChnageHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
