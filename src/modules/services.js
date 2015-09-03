const module = angular.module('services', []);
module.service('Auth', require('../services/auth'));
module.service('DataStore', require('../services/datastore'));
