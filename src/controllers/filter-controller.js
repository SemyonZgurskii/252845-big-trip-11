import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const.js';

const checkActualEvents = (events, filterType) => {
  const currentTime = new Date();
  let isEventsMatch;

  switch (filterType) {
    case FilterType.FUTURE:
      isEventsMatch = events.some(({start}) => start.getTime() > currentTime.getTime());
      break;
    case FilterType.PAST:
      isEventsMatch = events.some(({start}) => start.getTime() < currentTime.getTime());
      break;
    case FilterType.EVERYTHING:
      isEventsMatch = true;
      break;
  }

  return isEventsMatch;
};

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandlers(this._onDataChange);

    this._activeFilterType = FilterType.EVERYTHING;
  }

  render() {
    const events = this._eventsModel.getAllEvents();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isDisabled: !checkActualEvents(events, filterType),
        checked: this._activeFilterType === filterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
