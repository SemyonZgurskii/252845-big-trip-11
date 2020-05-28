import FilterComponent from '../components/filter.js';
import RouteComponent from '../components/route.js';
import PriceComponent from '../components/price.js';
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

export default class HeaderController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._mainControlsElement = this._container.querySelector(`.trip-main__trip-controls`);
    this._infoElement = this._container.querySelector(`.trip-main__trip-info`);

    this._filterComponent = null;
    this._priceComponent = null;
    this._routeComponent = null;

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
    const oldFilterComponent = this._filterComponent;
    const oldRouteComponent = this._routeComponent;
    const oldPriceComponent = this._priceComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setModeChangeHandler(this._onFilterChange);

    this._routeComponent = new RouteComponent(events);
    this._priceComponent = new PriceComponent(events);

    if (oldFilterComponent || oldRouteComponent || oldPriceComponent) {
      replace(this._filterComponent, oldFilterComponent);
      replace(this._routeComponent, oldRouteComponent);
      replace(this._priceComponent, oldPriceComponent);
    } else {
      render(this._mainControlsElement, this._filterComponent, RenderPosition.BEFOREEND);
      render(this._infoElement, this._routeComponent, RenderPosition.BEFOREEND);
      render(this._infoElement, this._priceComponent, RenderPosition.BEFOREEND);
    }
  }

  resetFilter() {
    this._onFilterChange(FilterType.EVERYTHING);
    this._filterComponent.setDefaultMode();
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
