import Event from "./models/event.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status} : ${response.statusText}`);
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getEvents() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  updateEvent(id, data) {
    // debugger;
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvent);
  }
}
