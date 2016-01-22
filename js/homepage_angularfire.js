console.clear();
(function(){

var app = angular.module('smartHouse', ['firebase']);

app.controller('houseController', ['$scope', '$firebaseObject',
function ($scope, $firebaseObject) {

  var ref = new Firebase('https://smart-house.firebaseio.com/');

  // download users to local object
  $scope.house = $firebaseObject(ref);

  // $scope.users = $scope.house.users;

  }
]);

})();
