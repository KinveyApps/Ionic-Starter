angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // App Controller
})

.controller('BooksCtrl', function(books, $scope, $kinvey) {
  var store = $kinvey.DataStore.getInstance('books');
  $scope.books = books;

  $scope.refresh = function() {
    store.find().then(function(response) {
      return response.networkPromise;
    }).then(function(books) {
      $scope.books = books;
      $scope.$digest();
    });
  };

  $scope.$on('$ionicView.enter', function() {
    $scope.refresh();
  });
});
