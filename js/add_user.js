console.clear();

var app = angular.module('addUser', ['firebase']);

app.controller('userController', ['$scope', '$firebaseObject',
function ($scope, $firebaseObject) {

  var ref = new Firebase('https://smart-house.firebaseio.com/');

  // download users to local object
  $scope.house = $firebaseObject(ref);

  $scope.favorite = function(index) {
    var item = $scope.videos[index];
    item.favorite = !item.favorite;
    $scope.videos.$save(item);
  };

  $scope.delete = function(index) {
    var toDelete = confirm("Are you sure you wish to delete this video?");

    if (toDelete) {
      var item = $scope.videos[index];
      $scope.videos.$remove(item);
    }
  };

  $scope.addUser = function(name, priority, status) {
    console.log("-----------------");
    console.log(name);
    console.log(priority);
    console.log(status);
    console.log("-----------------");

    var usersRef = ref.child("users");

    usersRef.push().set(
      {name: name, priority: priority, status: status, location: "outside", posX: 0, posY: 0}      );

      $scope.name = "";
      $scope.priority = "";
      $scope.status = "";
    };
  }
]);
