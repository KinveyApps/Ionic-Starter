(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/config');
require('./modules/controllers');
require('./modules/services');
var initialized = false;

var app = angular.module('Kinvey', ['ionic', 'kinvey', 'config', 'controllers', 'services']);

app.config(function ($logProvider) {
  'ngInject';

  // Enable log
  $logProvider.debugEnabled(true);
});

app.config(function ($stateProvider) {
  'ngInject';

  // Setup the states
  $stateProvider.state('welcome', {
    url: '',
    templateUrl: 'views/welcome.html',
    data: {
      requiresAuthorization: false
    },
    controller: 'WelcomeCtrl as vm'
  }).state('logout', {
    url: '/logout',
    data: {
      requiresAuthorization: true
    },
    controller: function controller($state, Auth) {
      'ngInject';

      Auth.logout().then(function () {
        $state.go('welcome');
      });
    }
  }).state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'MenuCtrl as vm'
  }).state('posts', {
    parent: 'app',
    url: '/posts',
    views: {
      content: {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl as vm',
        resolve: {
          posts: function posts(DataStore) {
            'ngInject';
            return DataStore.find('posts');
          }
        }
      }
    },
    data: {
      requiresAuthorization: true
    }
  });
});

app.run(function ($ionicPlatform, $kinvey, $rootScope, $state, KinveyConfig, Auth) {
  'ngInject';

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    toState.data = toState.data || {};

    if (!initialized) {
      event.preventDefault();

      // Initialize Kinvey
      $kinvey.init(KinveyConfig).then(function () {
        initialized = true;
        $state.go(toState.name, toParams);
      });
    } else if (toState.data.requiresAuthorization && !$kinvey.getActiveUser()) {
      event.preventDefault();

      // Login
      Auth.login().then(function () {
        $state.go(toState.name, toParams);
      });
    }
  });

  $ionicPlatform.ready(function () {
    var cordova = window.cordova;
    var StatusBar = window.StatusBar;

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (cordova && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $state.go('welcome');
});

},{"./modules/config":5,"./modules/controllers":6,"./modules/services":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MenuCtrl = function MenuCtrl($scope) {
  'ngInject';

  _classCallCheck(this, MenuCtrl);
};

exports['default'] = MenuCtrl;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PostsCtrl = function PostsCtrl(posts) {
  'ngInject';

  _classCallCheck(this, PostsCtrl);

  this.posts = posts;
};

exports['default'] = PostsCtrl;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WelcomeCtrl = (function () {
  function WelcomeCtrl($state) {
    'ngInject';

    _classCallCheck(this, WelcomeCtrl);

    this.$state = $state;
  }

  _createClass(WelcomeCtrl, [{
    key: 'getStarted',
    value: function getStarted() {
      this.$state.go('posts');
    }
  }]);

  return WelcomeCtrl;
})();

exports['default'] = WelcomeCtrl;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

var _module = angular.module('config', []);
_module.constant('KinveyConfig', {
  appKey: 'kid_byGoHmnX2',
  appSecret: '9b8431f34279434bbedaceb2fe6b8fb5',
  apiHostName: 'https://baas.kinvey.com'
});

},{}],6:[function(require,module,exports){
'use strict';

var _module = angular.module('controllers', []);
_module.controller('MenuCtrl', require('../controllers/menu'));
_module.controller('PostsCtrl', require('../controllers/posts'));
_module.controller('WelcomeCtrl', require('../controllers/welcome'));

},{"../controllers/menu":2,"../controllers/posts":3,"../controllers/welcome":4}],7:[function(require,module,exports){
'use strict';

var _module = angular.module('services', []);
_module.service('Auth', require('../services/auth'));
_module.service('DataStore', require('../services/datastore'));

},{"../services/auth":8,"../services/datastore":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth = (function () {
  function Auth($ionicModal, $ionicPopup, $rootScope, $kinvey) {
    'ngInject';

    _classCallCheck(this, Auth);

    this.$ionicModal = $ionicModal;
    this.$ionicPopup = $ionicPopup;
    this.$rootScope = $rootScope;
    this.$kinvey = $kinvey;
  }

  _createClass(Auth, [{
    key: 'login',
    value: function login() {
      var _this = this;

      return new Promise(function (resolve) {
        var $scope = _this.$rootScope.$new(); // Create a new $scope

        // Attach a submit handler to the $scope to login
        // the user when the form is submitted
        $scope.submit = function (username, password) {
          $scope.error = false;

          _this.$kinvey.User.login(username, password).then(function (user) {
            // Resolve with the user
            resolve(user);

            // Remove the modal
            $scope.modal.remove();

            // Show an alert for a successful login
            _this.$ionicPopup.alert({
              title: 'Login Success',
              template: 'You have been logged in.',
              buttons: [{
                text: 'Ok',
                type: 'button-kinvey'
              }]
            });
          })['catch'](function () {
            $scope.password = undefined;
            $scope.error = true;
          });
        };

        Promise.resolve().then(function () {
          var loginModal = _this.$rootScope.loginModal;

          if (loginModal) {
            loginModal.animation = undefined;
            return loginModal.remove();
          }
        }).then(function () {
          // Create a modal and show it
          _this.$ionicModal.fromTemplateUrl('views/auth.html', {
            scope: $scope,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
          }).then(function (modal) {
            $scope.modal = modal;
            _this.$rootScope.loginModal = modal;
            return modal.show();
          });
        });
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this2 = this;

      if (this.$kinvey.getActiveUser()) {
        return this.$kinvey.User.logout().then(function () {
          _this2.$ionicPopup.alert({
            title: 'Logout Success',
            template: 'You have been logged out.',
            buttons: [{
              text: 'Ok',
              type: 'button-kinvey'
            }]
          });
        });
      }

      return Promise.resolve();
    }
  }]);

  return Auth;
})();

exports['default'] = Auth;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DataStore = (function () {
  function DataStore($kinvey) {
    'ngInject';

    _classCallCheck(this, DataStore);

    this.$kinvey = $kinvey;
  }

  _createClass(DataStore, [{
    key: 'find',
    value: function find(collection, query, options) {
      return this.$kinvey.DataStore.find(collection, query, options);
    }
  }]);

  return DataStore;
})();

exports['default'] = DataStore;
module.exports = exports['default'];

},{}]},{},[1]);
