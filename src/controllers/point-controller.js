import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import {render, RenderPosition} from "../utils/render.js";

export default class PontController {
  constructor(container, event) {
    this._container = container;
    this._event = event;

    this._eventComponent = null;
    this._eventEditComponent = null;
  }

  renderEvent() {
    this._eventComponent = new EventComponent(this._event);
    this._eventEditComponent = new EventEditComponent(this._event);

    const replaceEventToEdit = () => {
      this._container.replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
    };

    const replaceEditToEvent = () => {
      this._container.replaceChild(this._eventComponent.getElement(), this._eventEditComponent.getElement());
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._eventComponent.setEditButtonHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => {
      replaceEditToEvent();
    });

    render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
  }
}
