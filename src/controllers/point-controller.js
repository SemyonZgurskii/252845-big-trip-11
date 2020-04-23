import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import {render, RenderPosition, replace} from "../utils/render.js";

export default class PontController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderEvent(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event);

    this._eventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoriteHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
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
