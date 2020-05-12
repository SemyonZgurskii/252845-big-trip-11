import Event from "./models/event.js";
import Destination from "./models/destination.js";
import TypeOptions from "./models/type-options.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status} : ${response.statusText}`);
};

export default class API {
  constructor(endPoint, authorization) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  deleteEvent(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  getDestinations() {
    return this._load({
      url: `destinations`,
    })
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  getOptions() {
    return this._load({
      url: `offers`,
    })
      .then((response) => response.json())
      .then((TypeOptions.parseTypesOptions));
  }

  getEvents() {
    return this._load({url: `points`})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvents);
  }


  updateEvent(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
