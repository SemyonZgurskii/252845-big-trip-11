import AbstractComponent from "./abstract-component";

const createBoardTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->
    </section>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
