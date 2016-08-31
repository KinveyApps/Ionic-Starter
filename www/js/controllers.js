angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // App Controller
})

.controller('BooksCtrl', function($scope, $kinvey) {
  var store = $kinvey.DataStore.collection('books');
  store.useDeltaFetch = false;

  $scope.refresh = function() {
    store.find().subscribe(function(books) {
      $scope.books = books;
      $scope.$digest();
    });
  };

  $scope.$on('$ionicView.enter', function() {
    $scope.books = [];
    $scope.refresh();
  });
});
