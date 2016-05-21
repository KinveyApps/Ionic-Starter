angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
  // App Controller
})

.controller('BooksCtrl', function(books, $scope, $kinvey) {
  var store = $kinvey.DataStore.collection('books');
  $scope.books = books;

  $scope.refresh = function() {
    store.find().subscribe(function(data) {
      $scope.books = data;
      $scope.$digest();
    });
  };

  $scope.$on('$ionicView.enter', function() {
    $scope.refresh();
  });
});
