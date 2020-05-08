export default class Offer {
  constructor(data) {
    this.type = data.type;
    this.offer = data.offer;
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffer(data) {
    return data.map(Offer.parseOffer);
  }
}
