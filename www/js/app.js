// Kinvey Ionic Starter App

angular.module('starter', [
  'kinvey',
  'ionic',
  'starter.controllers'
])

.run(function($ionicPlatform, $kinvey, $rootScope, $state, $ionicModal, $timeout) {
  // Show a login view if there is not an active user but
  // the toState requires a user to be active.
  var stateChangeStartListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var activeUser = $kinvey.User.getActiveUser();
    var activeUserRequired = toState.data ? toState.data.activeUserRequired : false;

    if (activeUserRequired === true && !activeUser) {
      // Create a new $scope
      var $scope = $rootScope.$new();
      $scope.loginData = {};
      $scope.errorMessage = null;

      // Create the login modal and show it
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function(modal) {
        modal.show();
        $scope.modal = modal;
      });

      // Hide the modal and destroy the $scope
      $scope.closeLogin = function() {
        $scope.modal.hide().then(function() {
          $scope.$destroy();
        });
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        $scope.errorMessage = null;

        // Login a user and close the modal
        $kinvey.User.login($scope.loginData).then(function() {
          $state.go(toState.name, toParams, { reload: true });
          $scope.closeLogin();
        }).catch(function(error) {
          $scope.errorMessage = 'Invalid username and/or password. Please try again.';
          $scope.$digest();
        });
      };

      // Remove the modal when the $scope is destroyed
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    }
  });

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($kinveyProvider, $stateProvider, $urlRouterProvider) {
  $kinveyProvider.init({
    appKey: '<appKey>',
    appSecret: '<appSecret>'
  });

  $stateProvider
    .state('logout', {
      url: '/logout',
      controller: function($scope, $state, $kinvey) {
        $scope.$on('$ionicView.enter', function() {
          var user = $kinvey.User.getActiveUser();

          if (user) {
            return user.logout().then(function() {
              $state.go('app.books');
            });
          }

          $state.go('app.books');
        });
      }
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      data: {
        activeUserRequired: true
      }
    })
    .state('app.books', {
      url: '/books',
      views: {
        'menuContent': {
          templateUrl: 'templates/books.html',
          controller: 'BooksCtrl'
        }
      }
    });


  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/books');
});
