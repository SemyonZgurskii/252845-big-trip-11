import {createElement} from "../utils.js";

const createDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class Info {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDaysContainerTemplate();
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
