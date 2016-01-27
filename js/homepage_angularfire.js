console.clear();
(function(){

  var app = angular.module('smartHouse', ['firebase']);

  app.controller('houseController', ['$scope', '$firebaseObject',
  function ($scope, $firebaseObject) {

    var ref = new Firebase('https://smart-house.firebaseio.com/');
	//var usersRef = new Firebase('https://smart-house.firebaseio.com/users/');

    // download users to local object
	$scope.ref = ref;
    $scope.house = $firebaseObject(ref);
    $scope.house.$loaded().then(function() {
      setTimeout(function(){ 
		$('[data-toggle="popover"]').popover({html: true}); 
		$(".draggable").draggable({
			stop: function(event, ui) {
				$scope.house.users[event.target.id].posX = ui.position.left;
				$scope.house.users[event.target.id].posY = ui.position.top;
				$scope.house.$save();
			}
		});
		for (var key in $scope.house.users) {
			if($scope.house.users.hasOwnProperty(key)) {
				$("#"+key).css({'top': $scope.house.users[key].posY, 'left' : $scope.house.users[key].posX});
			}
		}
		ref.child("users").on('child_changed', function(childSnapshot, prevChildKey) {
			$("#"+childSnapshot.key()).css({'top': childSnapshot.val().posY, 'left' : childSnapshot.val().posX});
		});
	  }, 0);
    });

    $scope.roomClick = function(roomId) {
      console.log("room: " + roomId);
    };

  }]);

})();
