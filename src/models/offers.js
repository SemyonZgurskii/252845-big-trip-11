export default class Offers {
  constructor() {
    this._offers = new Map();
  }

  setOffers(offers) {
    for (const offer of offers) {
      this._offers.set(offer.type, offer.offers);
    }
  }

  getOffers() {
    return this._offers;
  }
}
