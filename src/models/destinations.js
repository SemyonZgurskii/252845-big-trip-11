export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  getInformation(destinationName) {
    console.log(destinationName);
    console.log(this._destinations);
    this._destinations.find((destination) => destination.name === destinationName);
  }
}
