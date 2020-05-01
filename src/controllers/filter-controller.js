import FilterComponent from '../components/filter.js';
import {render, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    // this._onDataChange = this._onDataChange.bind(this);

    // this._eventsModel.setDataChangeHandler(this._onDataChange);

    this._activeFilterType = FilterType.EVERYTHING;
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: this._activeFilterType === filterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  // _onDataChange() {
  //   this.render();
  // }
}
