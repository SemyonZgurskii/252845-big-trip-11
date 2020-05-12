import Event from "../models/event.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  getOptions() {
    if (isOnline()) {
      return this._api.getOptions();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = events.reduce((acc, event) => {
            return Object.assign({}, acc, {
              [event.id]: event,
            });
          }, {});

          this._store.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.reject(Event.parseEvents(storeEvents));
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Event.clone(Object.assign(event, {id: localNewEventId}));

    return Promise.reject(localNewEvent);
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = Event.clone(Object.assign(event, {id}));

    this._store.setItem(id, localEvent.toRAW());

    return Promise.reject(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.reject(`offline logic is not implemented`);
  }
}
