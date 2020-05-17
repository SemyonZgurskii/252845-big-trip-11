import Event from "../models/event.js";
import {nanoid} from "nanoid";

const StorageKey = {
  EVENTS: `events`,
  DESTINATIONS: `destinations`,
  OPTIONS: `options`,
};

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {

          this._store.setItem(StorageKey.DESTINATIONS, destinations);

          return destinations;
        });
    }

    const storeDestinations = this._store.getItem(StorageKey.DESTINATIONS);

    return Promise.resolve(Array.from(storeDestinations));
  }

  getOptions() {
    if (isOnline()) {
      return this._api.getOptions()
        .then((options) => {

          this._store.setItem(StorageKey.OPTIONS, options);

          return options;
        });
    }

    const storeOptions = this._store.getItem(StorageKey.OPTIONS);

    return Promise.resolve(Array.from(storeOptions));
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const newEvents = createStoreStructure(events.map((event) => event.toRAW()));

          this._store.setItem(StorageKey.EVENTS, newEvents);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItem(StorageKey.EVENTS));

    return Promise.resolve(Event.parseEvents(storeEvents));
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItemProperty(StorageKey.EVENTS, newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Event.clone(Object.assign(event, {id: localNewEventId}));

    this._store.setItemProperty(StorageKey.EVENTS, localNewEventId, localNewEvent);

    return Promise.resolve(localNewEvent);
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._store.setItemProperty(StorageKey.EVENTS, newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localEvent = Event.clone(Object.assign(event, {id}));

    this._store.setItemProperty(StorageKey.EVENTS, id, localEvent.toRAW());

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItemProperty(StorageKey.EVENTS, id));
    }

    this._store.removeItemProperty(StorageKey.EVENTS, id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItem(StorageKey.EVENTS));

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updateEvents = getSyncedEvents(response.updated);

          const loadedEvents = createStoreStructure(createdEvents.concat(updateEvents));

          this._store.setItem(StorageKey.EVENTS, loadedEvents);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
