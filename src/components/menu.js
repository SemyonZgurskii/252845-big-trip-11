import AbstractComponent from "./abstract-component.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const createMenuTemplate = () => {
  return (
    `<div>
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
    </div>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setOnItemClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      this._deleteActiveClass();
      evt.target.classList.add(ACTIVE_CLASS);

      const menuItem = evt.target.textContent;
      handler(menuItem);
    });
  }

  _deleteActiveClass() {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((item) => {
        if (item.classList.contains(ACTIVE_CLASS)) {
          item.classList.remove(ACTIVE_CLASS);
        }
      });
  }
}

export {
  MenuItem,
};
