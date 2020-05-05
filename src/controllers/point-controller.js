import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EmptyEvent = {
  type: `flight`,
  city: ``,
  options: ``,
  info: ``,
  price: ``,
  start: new Date(),
  end: new Date(),
  isFavorite: false,
};
export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderEvent(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event);

    this._eventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._eventEditComponent.isValid()) {
        const data = this._eventEditComponent.getData();
        this._onDataChange(this, event, data);
      }
    });

    this._eventEditComponent.setFavoriteHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() =>{
      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();
    this._container.replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    this._container.replaceChild(this._eventComponent.getElement(), this._eventEditComponent.getElement());

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {
  Mode,
  EmptyEvent
};
