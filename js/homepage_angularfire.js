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

        ref.child("users").on('child_changed', function(childSnapshot, prevChildKey) {
          $("#"+childSnapshot.key()).css({'top': childSnapshot.val().posY, 'left' : childSnapshot.val().posX});
        });

        // speech recognition
        if (annyang) {

          console.log("Annyang activated.");

          var commands = {

            // How to use annyang commands

            // annyang will capture anything after a asterisk (*) and pass it to the function.
            // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
            // 'show me *tag': function(tag) {
            //   var url = 'http://api.flickr.com/services/rest/?tags=' + tag;
            //   $.getJSON(url);
            // },

            // A named variable is a one word variable, that can fit anywhere in your command.
            // e.g. saying "calculate October stats" will call calculateStats('October');
            // 'calculate :month stats': function(month) {
            //   $('#stats').text('Statistics for '+month);
            // },

            // By defining a part of the following command as optional, annyang will respond
            // to both: "say hello to my little friend" as well as "say hello friend"
            // 'hey (ho) (Jose) (José) say hello (to my little) friend': function() {
            //   console.log("Brrrrrappp brap brrrappp!");
            // }

            "hey (ho) (Jose) (José) turn on all the lights": function() {
              alert("Turning on all the lights...");
              console.log("Turning on lights...");
            },

            "hey (ho) (Jose) (José) set the temperature to :deg degrees": function(deg) {
              alert("Setting the temperature to " + deg + " degrees.");
            },

            "hey (ho) (Jose) (José) turn on (the) :room (light) (lights)": function(roomName) {
              alert("Turning on the " + roomName + " lights.");
            },

            "hey (ho) (Jose) (José) turn on the lights in (the) *room": function(room) {
              alert("Turning on the lights in the " + room);
            },

            "hey (ho) (Jose) (José) turn on the lights": function() {
              // TODO: track what room the use is in and turn the lights on
              alert("Turning on the lights in your room.");
            },

            // special case for living room
            "hey (ho) (Jose) (José) turn on (the) living room lights": function() {
              alert("Turning on the living room lights");
            }

          };

          // Add our commands to annyang
          annyang.addCommands(commands);

          // To print what annyang hears
          annyang.debug();

          $(".user").dblclick(function(){

            console.log("Clicked on " + this.id);

            console.log("Starting Annyang");
            annyang.start();

            setTimeout(function() {
              console.log("Pausing annyang");
              annyang.abort();
            }, 6000);

          });

        }

      }, 0);
    });

    $scope.roomClick = function(roomId) {
      console.log("room: " + roomId);
    };

    $scope.updateTemperature = function(val) {
      document.getElementById('temperature').textContent = val;
    };

  }]);

})();
