import EventEditComponent from "../components/event-edit.js";
import EventComponent from "../components/event.js";
import EventModel from "../models/event.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EmptyEvent = {
  type: `flight`,
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

  renderEvent(event, destinations, offers, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, destinations, offers);

    this._eventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._eventEditComponent.checkValidity();
      if (this._eventEditComponent.isValid()) {
        const data = this._eventEditComponent.getData();
        const dataModel = EventModel.clone(data);

        this._eventEditComponent.getElement().classList.remove(`send-error`);
        this._eventEditComponent.setButtonsText({
          saveButton: `Saving...`,
        });
        this._eventEditComponent.disableInputs();

        this._onDataChange(this, event, dataModel);
      }
    });

    this._eventEditComponent.setFavoriteHandler(() => {
      const dataModel = EventModel.clone(event);
      dataModel.isFavorite = !event.isFavorite;

      this._onDataChange(this, event, dataModel);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() =>{
      this._eventEditComponent.setButtonsText({
        deleteButton: `Deleting...`,
      });
      this._eventEditComponent.disableInputs();
      this._eventEditComponent.getElement().classList.remove(`send-error`);

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
          this._eventEditComponent.setButtonsText({
            saveButton: `Save`,
            deleteButton: `Delete`,
          });
        }
        break;
      case Mode.ADDING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        this._eventEditComponent.setButtonsText({deleteButton: `Cancel`});
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
      this._eventEditComponent.reset();
      this._replaceEditToEvent();
    }
  }

  shake() {
    const eventElement = this._eventComponent.getElement();
    const eventEditElement = this._eventEditComponent.getElement();

    eventElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    eventEditElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      eventElement.style.animation = ``;
      eventEditElement.style.animation = ``;

      this._eventEditComponent.setButtonsText({
        saveButton: `Save`,
        deleteButton: `Delete`,
      });

      this._eventEditComponent.enableInputs();
      this._eventEditComponent.getElement().classList.add(`send-error`);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    this._container.replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      } else {
        this._eventEditComponent.reset();
        this._replaceEditToEvent();
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {
  Mode,
  EmptyEvent
};
