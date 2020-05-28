import AbstractComponent from "./abstract-component.js";
import {makeFirstLetterUppercase, getMarkupFromArray} from "../utils/common.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const generateFilterMarkup = (filter) => {
  const {name, isChecked, isDisabled} = filter;
  const filterTitle = makeFirstLetterUppercase(name);

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${isChecked ? `checked` : ``}
      ${isDisabled ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${filterTitle}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = getMarkupFromArray(filters, generateFilterMarkup);

  return (
    `<div>
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filtersMarkup}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    </div>`
  );
};


export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setModeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }

  setDefaultMode() {
    this.getElement().querySelector(`#filter-everything`)
      .checked = true;
  }
}
