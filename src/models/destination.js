export default class Destination {
  constructor(data) {
    this.name = data.name;
    this.pictures = data.pictures;
    this.description = data.description;
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
