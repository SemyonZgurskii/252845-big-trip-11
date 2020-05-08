export default class AllOptions {
  constructor() {
    this._offers = new Map();
  }

  setOptions(offers) {
    for (const offer of offers) {
      this._offers.set(offer.type, offer.offers);
    }
  }

  getOptions() {
    return this._offers;
  }
}
