import AbstractComponent from "./abstract-component";
import {createElement, RenderPosition} from "../utils/render.js";

const createBoardTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->
    </section>`
  );
};

const createLoadingMessage = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class Board extends AbstractComponent {
  constructor() {
    super();

    this._loadingElement = createElement(createLoadingMessage());
  }

  getTemplate() {
    return createBoardTemplate();
  }

  loadingStatusOn() {
    this.getElement().appendChild(this._loadingElement, RenderPosition.BEFOREEND);
  }

  loadingStatusOff() {
    this.getElement().removeChild(this._loadingElement);
  }
}
