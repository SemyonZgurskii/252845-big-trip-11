export default class Store {
  constructor(store) {
    this._store = store;
  }

  getItem(key) {
    try {
      return JSON.parse(this._store.getItem(key)) || {};
    } catch (err) {
      return {};
    }
  }


  setItem(key, value) {
    const item = this.getItem(key);
    if (item === {}) {
      this._store.setItem([key], JSON.stringify(value));
    } else {
      this._store.setItem(
          key,
          JSON.stringify(
              Object.assign({}, item, value)
          )
      );
    }
  }

  setItemProperty(key, property, value) {
    const item = this.getItem(key);

    this._store.setItem(
        key,
        JSON.stringify(
            Object.assign({}, item, {
              [property]: value,
            })
        )
    );
  }

  removeItemProperty(key, property) {
    const item = this.getItem(key);
    delete item[property];

    this._store.setItem(key, item);
  }
}
