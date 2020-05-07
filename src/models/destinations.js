export default class Destinations {
  constructor() {
    this._destinations = null;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getInformation(destinationName) {
    this._destinations.find((destination) => destination.name === destinationName);
  }
}
