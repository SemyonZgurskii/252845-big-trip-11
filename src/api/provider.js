export default class Provide {
  constructor(api) {
    this._api = api;
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOptions() {
    return this._api.getOptions();
  }

  getEvents() {
    return this._api.getEvents();
  }

  createEvent(event) {
    return this._api.createEvent(event);
  }

  updateEvent(id, event) {
    return this._api.updateEvent(id, event);
  }

  deleteEvent(id) {
    return this._api.deleteEvent(id);
  }
}
