// id: "0"
// type: "drive"
// date_from: "2020-05-03T11:28:43.632Z"
// date_to: "2020-05-03T22:42:01.747Z"
// destination:
// name: "Helsinki"
// description: "Helsinki, for those who value comfort and coziness, full of of cozy canteens where you can try the best coffee in the Middle East."
// pictures: (5) [{…}, {…}, {…}, {…}, {…}]
// __proto__: Object
// base_price: 600
// is_favorite: false
// offers: Array(2)
// 0:
// title: "Choose comfort class"
// price: 110
// __proto__: Object
// 1:
// title: "Choose business class"
// price: 180


// pictures: Array(5)
// 0: {src: "http://picsum.photos/300/200?r=0.8849273242134856", description: "Helsinki city centre"}
// 1: {src: "http://picsum.photos/300/200?r=0.29944931142209574", description: "Helsinki kindergarten"}
// 2: {src: "http://picsum.photos/300/200?r=0.7825847045294572", description: "Helsinki biggest supermarket"}
// 3: {src: "http://picsum.photos/300/200?r=0.5424191402625576", description: "Helsinki embankment"}
// 4: {src: "http://picsum.photos/300/200?r=0.667840126325747", description: "Helsinki street market"}

export default class Event {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    // this.city = data.destination.name || ``;
    this.options = data.offers || ``;
    // this.description = data.destination.description || ``;
    // this.photos = data.destination.pictures || ``;
    this.destination = data.destination || ``;
    this.price = data.base_price;
    this.start = new Date(data.date_from);
    this.end = new Date(data.date_to);
    this.isFavorite = data.is_favorite;
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }
}
