import AbstractComponent from "./abstract-component";

const createNewEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return createNewEventButtonTemplate();
  }

  enable() {
    this.getElement().disabled = false;
  }

  disable() {
    this.getElement().disabled = true;
  }

  setButtonClickHandler(handler) {
    const newEventButton = this.getElement();

    newEventButton.addEventListener(`click`, () => {
      this.disable();

      handler();
    });
  }
}
