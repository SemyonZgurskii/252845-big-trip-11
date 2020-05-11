export default class TypeOptions {
  constructor(data) {
    this.type = data.type;
    this.offers = data.offers;
  }

  static parseTypeOptions(data) {
    return new TypeOptions(data);
  }

  static parseTypesOptions(data) {
    return data.map(TypeOptions.parseTypeOptions);
  }
}
