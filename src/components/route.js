import {createElement} from "../utils.js";

const createRouteTemplate = () => {
  return (
    `<div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>`
  );
};

export default class Route {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createRouteTemplate();
  }

  getElement() {
    if (!this._element) {
      return createElement(this.getTemplate());
    }

    return this._element();
  }

  removeElement() {
    this._element = null;
  }
}
