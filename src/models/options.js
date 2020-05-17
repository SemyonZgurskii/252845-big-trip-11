export default class Options {
  constructor() {
    this._options = new Map();
  }

  setOptions(options) {
    for (const option of options) {
      this._options.set(option.type, option.options);
    }
  }

  getOptions() {
    return this._options;
  }
}
