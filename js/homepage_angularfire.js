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
        if (annyang !== undefined) {

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

            "hey (ho) (Jose) (José) turn :onOrOff all the lights": function(onOrOff) {
              if (onOrOff === "on") {
                alert("Turning on all the lights.");
              } else if (onOrOff === "off") {
                alert("Turning off all the lights.");
              }
            },

            "hey (ho) (Jose) (José) set the temperature to :deg (degrees)": function(deg) {
              alert("Setting the temperature to " + deg + " degrees.");
            },

            "hey (ho) (Jose) (José) turn :onOrOff (the) (:room) (light) (lights)": function(onOrOff, roomName) {
              if (onOrOff === "on") {
                alert("Turning on the lights in the " + roomName);
              } else if (onOrOff === "off") {
                alert("Turning off the lights in the " + roomName);
              }
            },

            "hey (ho) (Jose) (José) turn on the lights in (the) *room": function(room) {
              alert("Turning on the lights in the " + room);
            },

            "hey (ho) (Jose) (José) turn on the lights": function() {
              // TODO: track what room the use is in and turn the lights
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
		  console.log($(".room"))
          
		  $(".room").droppable({

			drop: function(event, ui) {
                console.log("foo");
			  // $(this)
			  // .addClass( "ui-state-highlight" );

			  //change the occupants attribute to track who's in what place.
			  if(event.target.getAttribute("occupants") !== null) {
				event.target.setAttribute("occupants", $.trim(event.target.getAttribute("occupants") + " " + $(ui.draggable)[0].getAttribute("id")));
				$scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
				$scope.house.$save();
			  }
			  else {
				event.target.setAttribute("occupants", $.trim($(ui.draggable)[0].getAttribute("id")));
				$scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
				$scope.house.$save();
			  }

			  event.target.style.backgroundColor = "yellow";
			},
			out: function(event, ui) {
			  //leaves some random spaces but unless you're moving several thousand dudes in and out it's no problem.
			  var name = $(ui.draggable)[0].getAttribute("id");
			  var index = event.target.getAttribute("occupants").indexOf(name);
			  var occupants = event.target.getAttribute("occupants");
			  occupants = occupants.slice(0,index) + occupants.slice(index+name.length);
			  event.target.setAttribute("occupants", $.trim(occupants));
			  $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
			  $scope.house.$save();
			  // check if there is still an occupant
			  if($.trim(occupants) === '') {
				event.target.style.backgroundColor = "white";
			  }

			}

		  });

          function userLocation(id) {
            $(".room").each(function(num, room) {
				console.log(room);
				if(room.getAttribute("occupants") !== null && room.getAttribute("occupants").indexOf(id) >= 0) {
					return room;
				}
			});
          }
          $(".user").dblclick(function(){
            localStorage.userTalking = $(this).attr("name");
			localStorage.userRoom = userLocation(this.id);
			console.log("LocalStorage is:"); 	
			console.log(localStorage);
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
