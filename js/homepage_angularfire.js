console.clear();
var usertalking = '';
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

            "turn :onOrOff all the lights": function(onOrOff) {
              alert(usertalking);
              if (onOrOff === "on") {
                alert("Turning on all the lights.");
              } else if (onOrOff === "off") {
                alert("Turning off all the lights.");
              }
            },

            "(set) (change) (the) temperature (to) :deg (degrees)": function(deg) {
              alert(usertalking);
              if (parseInt(deg) > 59 && parseInt(deg) < 101) {
                alert("Setting the temperature to " + deg + " degrees.");
              } else {
                alert("Check your temperature range and try again.");
              }
            },

            "(set) (change) (the) mode (to) :mode (mode)": function(mode) {
              alert("Changing the mode to " + mode);
            },

            "(set) (change) (the) volume (to) :volume (mode)": function(volume) {

            },

            "turn :onOrOff (the) (:room) (light) (lights)": function(onOrOff, roomName) {
              alert(usertalking);
              if (onOrOff === "on") {
                alert("Turning on the lights in the " + room);
              } else if (onOrOff === "off") {
                alert("Turning off the lights.");
              }
            },

            "turn on the lights in (the) *room": function(room) {
              alert(usertalking);
              alert("Turning on the lights in the " + room);
            },

            "hey (ho) (Jose) (José) turn on the lights": function() {
              // TODO: track what room the use is in and turn the lights on
              alert(usertalking);
              alert("Turning on the lights in your room.");
            },

            // special case for living room
            "turn on (the) living room lights": function() {
              alert(usertalking);
              alert("Turning on the living room lights");
            }

          };

          // Add our commands to annyang
          annyang.addCommands(commands);

          // To print what annyang hears
          annyang.debug();

          $(".user").dblclick(function(){

            usertalking = $(this).attr("name");
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
