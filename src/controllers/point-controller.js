import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import {render, RenderPosition} from "../utils/render.js";

export default class PontController {
  constructor(container) {
    this._container = container;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderEvent(event) {
    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event);

    this._eventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => {
      this._replaceEditToEvent();
    });

    render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceEventToEdit() {
    this._container.replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
  }

  _replaceEditToEvent() {
    this._container.replaceChild(this._eventComponent.getElement(), this._eventEditComponent.getElement());
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
