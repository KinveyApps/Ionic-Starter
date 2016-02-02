export default class DataStore {
  constructor($kinvey) {
    'ngInject';

    this.$kinvey = $kinvey;
  }

  find(collection, query, options) {
    return this.$kinvey.DataStore.find(collection, query, options);
  }
}
