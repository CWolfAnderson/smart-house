console.clear();
var usertalking = '';
var currentRoom;
var globalScope;

(function(){
  
  var app = angular.module('smartHouse', ['firebase']);
  
  app.controller('houseController', ['$scope', '$firebaseObject',
  function ($scope, $firebaseObject) {
    
    globalScope = $scope;
    
    var ref = new Firebase('https://smart-house.firebaseio.com/');
    
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

            "turn :onOrOff all the lights": function(onOrOff) {
              alert(usertalking);
              if (onOrOff === "on") {
                alert("Turning on all the lights.");
              } else if (onOrOff === "off") {
                alert("Turning off all the lights.");
              }
            },
            
            "(set) (change) (make) (the) temperature (to) :deg (degrees)": function(deg) {
              alert(usertalking);
              if (parseInt(deg) > 59 && parseInt(deg) < 101) {
                alert("Setting the temperature to " + deg + " degrees.");
              } else {
                alert("Check your temperature range and try again.");
              }
            },
            
            "(set) (change) (make) (the) mode (to) :mode (mode)": function(mode) {
              alert("Changing the mode to " + mode);
            },
            
            "(set) (change) (make) (the) volume (to) :volume (mode)": function(volume) {
              alert("Setting the volume to " + volume);
            },
            
            "turn :onOrOff (the) (:room) (light) (lights)": function(onOrOff, roomName) {
              alert(usertalking);
              if (onOrOff === "on") {
                alert("Turning on the lights in the " + roomName);
              } else if (onOrOff === "off") {
                alert("Turning off the lights.");
              }
            },
            
            "(set) (change) (make) (the) light color (to) *color": function(color) {
              alert("Setting the light color to " + color);
            },
            
            "turn on the lights in (the) *room": function(room) {
              alert(usertalking);
              alert("Turning on the lights in the " + room);
            },
            
            "turn on the lights": function() {
              // TODO: track what room the use is in and turn the lights on
              alert(usertalking);
              alert("Turning on the lights in your room.");
            },
            
            // special case for living room
            "turn on (the) living room lights": function() {
              alert(usertalking);
              alert("Turning on the living room lights");
            },
            
            "play *artistOrSong": function(artistOrSong) {
              if (artistOrSong === "Nickelback") {alert("How about no...");} else {
                alert("Playing " + artistOrSong);
              }
            }
            
          };
          
          // Add our commands to annyang
          annyang.addCommands(commands);
          
          // To print what annyang hears
          annyang.debug();
          
          $(".room").droppable({
            
            drop: function(event, ui) {
              
              // to getstatus of person after drop
              console.log(ui.draggable[0].getAttribute("status"));
              
              if (ui.draggable[0].getAttribute("status") === "unknown") {
                alert("Intruder alert! Interuder alert!");
                
                alarmInterval = setInterval(flashText, 500);
                
                $("body").append("<button onclick=stopAlarm()>Coast Clear</button>");                    
              }                    
              
              function flashText() {
                
                if ($(".room").css("backgroundColor") !== "rgb(213, 20, 20)") {
                  $(".room").css("backgroundColor", "rgb(213, 20, 20)");
                } else if ($(".room").css("backgroundColor") === "rgb(255, 255, 255)") {
                  $(".room").css("backgroundColor", "rgb(255, 255, 255)");
                } else {
                  $(".room").css("backgroundColor", "#f6f4f4");
                }
                
                console.log($(".room").css("backgroundColor"));
                // $(".room").css("backgroundColor", $(".room").css("backgroundColor") == "#b9b9b9" ? "#d51414" : "#b9b9b9");
                // 
              }
              
              function stopTextColor() {
                clearInterval(nIntervId);
              }            
              
              // $(this)
              // .addClass( "ui-state-highlight" );
              // <<<<<<< HEAD
              if(!$scope.house.rooms[event.target.getAttribute("DBid")].light.on) {
                $scope.house.rooms[event.target.getAttribute("DBid")].light.on = true;
                $scope.house.$save();
              }
              //event.target.style.backgroundColor = "yellow";
            },
            out: function(event, ui) {
              if($scope.house.rooms[event.target.getAttribute("DBid")].light.on) {
                $scope.house.rooms[event.target.getAttribute("DBid")].light.on = false;
                $scope.house.$save();
              }
              
              // =======
              //               
              //               //change the occupants attribute to track who's in what place.
              //               if(event.target.getAttribute("occupants") !== null && event.target.getAttribute("occupants").indexOf($(ui.draggable)[0].getAttribute("id"))) {
              //                 event.target.setAttribute("occupants", $.trim(event.target.getAttribute("occupants") + " " + $(ui.draggable)[0].getAttribute("id")));
              //                 $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
              //                 $scope.house.$save();
              //               }
              //               else {
              //                 event.target.setAttribute("occupants", $.trim($(ui.draggable)[0].getAttribute("id")));
              //                 $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
              //                 $scope.house.$save();
              //               }
              //               
              //               //event.target.style.backgroundColor = "yellow";
              //             },
              //             out: function(event, ui) {
              //               //leaves some random spaces but unless you're moving several thousand dudes in and out it's no problem.
              //               var name = $(ui.draggable)[0].getAttribute("id");
              //               var index = event.target.getAttribute("occupants").indexOf(name);
              //               var occupants = event.target.getAttribute("occupants");
              //               occupants = occupants.slice(0,index) + occupants.slice(index+name.length);
              //               event.target.setAttribute("occupants", $.trim(occupants));
              //               $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
              //               $scope.house.$save();
              //               // check if there is still an occupant
              //               if($.trim(occupants) === '') {
              //                 //event.target.style.backgroundColor = "white";
              //               }
              //               
              // >>>>>>> room_modifications
            }
            
          });
          
        }
        
      }, 0);
    });
    
    var roomAlert = customAlert();
    $scope.roomClick = function(room) {
      console.log("room: " + room);
      clickedRoom = room;
      // set values:
      // database: room.mode, room.light.on, room.light.color, room.temp, room.music.on, room.music.source, room.music.volume
      // ids: mode, light, light-color, temp-slider, music-on, music-source, volume
      $("[name=mode]").val(room.mode);
      
      $("#lightswitch").prop("checked", room.light.on);
      
      $("#light-color").val(room.light.color);     
      
      if (room.thermostat.on) {
        $("#temperature").text(room.thermostat.temp);      
        $("#temp-slider").val(room.thermostat.temp);        
      } else {
        $("#temperature").text("");
        $("#temp-slider").val(80);
      }
      $("#thermostatswitch").prop("checked", room.thermostat.on);
      
      $("#musicswitch").prop("checked", room.music.on);
      if (room.music.on) {
        $("#volume").text(room.music.volume);
        $("#volume-slider").val(room.music.volume);
      } else {
        $("#volume").text(0);
      }
      
      roomAlert.render(room);      
    };
    
    function customAlert() {
      return {
        render: function(room){
          var winW = window.innerWidth;
          var winH = window.innerHeight;
          var dialogoverlay = document.getElementById('dialogoverlay');
          var dialogbox = document.getElementById('dialogbox');
          dialogoverlay.style.display = "block";
          dialogoverlay.style.height = winH+"px";
          dialogbox.style.left = (winW/2) - (550 * 0.5)+"px";
          dialogbox.style.top = "100px";
          dialogbox.style.display = "block";
          document.getElementById('dialogboxhead').innerHTML = room.name;
          // document.getElementById('dialogboxbody').innerHTML = dialog;
          // set mode, light, temperature
          
          document.getElementById('dialogboxfoot').innerHTML = '<button onclick="dismissAlert()">OK</button>';
        
          currentRoom = room;
        }
      };      
    } // end customAlert
    
    $scope.userClick = function() {
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
    };
    
    function userLocation(id) {
      $(".room").each(function(num, room) {
        console.log(room);
        if(room.getAttribute("occupants") !== null && room.getAttribute("occupants").indexOf(id) >= 0) {
          return room;
        }
      });
    }
    
    $scope.updateTemperature = function(val) {
      document.getElementById('temperature').textContent = val;
    };
    
  }]);
  
})();

var alarmInterval;

// function dismissAlert() {
// 
//   // update firebase
//   // fredNameRef.update({ first: 'Fred', last: 'Flintstone' });
//   console.log("From dismissAlert:");
//   // console.log(currentRoom);
//   
//   // var rooms = new Firebase('https://smart-house.firebaseio.com/rooms');
//   // console.log("ROOMS:");
//   // console.log(rooms);
//   
//   
//   document.getElementById('dialogbox').style.display = "none";
//   document.getElementById('dialogoverlay').style.display = "none";
// }

function updateTemperature(val) {
  document.getElementById('temperature').textContent = val;
}

function updateVolume(val) {
  document.getElementById('volume').textContent = val;
}

var dismissAlert = function() {

  // update firebase
  // fredNameRef.update({ first: 'Fred', last: 'Flintstone' });
  console.log("From dismissAlert:");
  // console.log(currentRoom);
  
  console.log(currentRoom);
  // var rooms = new Firebase('https://smart-house.firebaseio.com/rooms');
  // console.log("ROOMS:");
  // console.log(rooms);
  currentRoom.mode = $("[name=mode]").val();
  
  currentRoom.light.on = $("#lightswitch").prop("checked");
  
  currentRoom.light.color = $("#light-color").val();     
  
  if (currentRoom.thermostat.on) {
	currentRoom.thermostat.temp = $("#temperature").text();
  }
  currentRoom.thermostat.on = $("#thermostatswitch").prop("checked");
  
  currentRoom.music.on = $("#musicswitch").prop("checked");
  if (currentRoom.music.on) {
	currentRoom.music.volume = $("#volume").text();
  }
  globalScope.house.$save();
  document.getElementById('dialogbox').style.display = "none";
  document.getElementById('dialogoverlay').style.display = "none";
};

function stopAlarm() {
  clearInterval(alarmInterval);
  location.reload();
}