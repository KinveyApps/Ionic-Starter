import Auth from '../services/auth';
import DataStore from '../services/datastore';

const module = angular.module('services', []);
module.service('Auth', Auth);
module.service('DataStore', DataStore);
