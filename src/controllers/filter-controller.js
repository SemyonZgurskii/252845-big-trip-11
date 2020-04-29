import FilterComponent from '../components/filter.js';
import {render, RenderPosition} from '../utils/render.js';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._filterComponent = new FilterComponent();
  }

  render() {
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
