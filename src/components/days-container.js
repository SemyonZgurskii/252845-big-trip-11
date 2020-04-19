import AbstractComponent from "./abstract-component.js";

const createDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class DaysContainer extends AbstractComponent {
  getTemplate() {
    return createDaysContainerTemplate();
  }
}
