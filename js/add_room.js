console.clear();

var app = angular.module('addUser', ['firebase']);

app.controller('userController', ['$scope', '$firebaseObject',
function ($scope, $firebaseObject) {

  var ref = new Firebase('https://smart-house.firebaseio.com/');

  // download users to local object
  $scope.house = $firebaseObject(ref);

  $scope.favorite = function(index) {
    // $scope.videos[index].favorite = !$scope.videos[index].favorite;
    var item = $scope.videos[index];
    item.favorite = !item.favorite;
    $scope.videos.$save(item);
  };

  $scope.delete = function(index) {
    var toDelete = confirm("Are you sure you wish to delete this video?");

    // if (toDelete) $scope.videos.splice(index, 1);
    if (toDelete) {
      var item = $scope.videos[index];
      $scope.videos.$remove(item);
    }
  };

  // addUser(name, priority, status, location, posX, posY)
  $scope.addRoom = function(name, id) {
    console.log("-----------------");
    console.log(name);
    console.log("-----------------");

    // $scope.house.users.add({name: name, priority: priority, status: status, location: "outside", posX: 0, posY: 0});

    var usersRef = ref.child("rooms");

    usersRef.push().set(
      {name: name, id: id, occupants: [], temp: "", mode: "", music: {on: false, source: "", volume: 0}, light: {on: false, color: "", intensity: 0}});

      // var users = ref.child("house");

      // $scope.house.users.$add({name: name, priority: priority, status: status, location: "outside", posX: 0, posY: 0});

      // $scope.house.users.push({name: name, priority: priority, status: status, location: "outside", posX: 0, posY: 0});

      $scope.name = "";
      $scope.id = "";
      
    };
  }
]);
