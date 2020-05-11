export default class Event {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.options = data.offers || ``;
    this.destination = data.destination || ``;
    this.price = data.base_price;
    this.start = new Date(data.date_from);
    this.end = new Date(data.date_to);
    this.isFavorite = data.is_favorite;
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "offers": this.options,
      "destination": this.destination || ``,
      "base_price": this.price,
      "date_from": this.start.toISOString(),
      "date_to": this.end.toISOString(),
      "is_favorite": this.isFavorite,
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
