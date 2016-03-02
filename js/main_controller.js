console.clear();
var usertalking = "";
var currentRoom;
var globalScope;
var alarmInterval;

(function(){
  
  var app = angular.module('smartHouse', ['firebase']);
  
  app.controller('houseController', ['$scope', '$firebaseObject',
  function ($scope, $firebaseObject) {
    
    globalScope = $scope;
    
    var ref = new Firebase('https://smart-house.firebaseio.com/');
    
    var fridgeRef = ref.child("fridge");
    
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
            
            "turn :onOrOff the lights": function(onOrOff) {
              
              if (userTalking.priority > 2) {
                if (onOrOff === "on") {
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].light.on = true;
                  $scope.house.$save();
                  responsiveVoice.speak("The lights are now on " + userTalking.name);
                  
                } else if (onOrOff === "off") {
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].light.on = false;
                  $scope.house.$save();
                  responsiveVoice.speak("The lights are now off " + userTalking.name);
                  
                }
              } else {
                responsiveVoice.speak(userTalking.name + ". You have no authoritah! " + userTalking.name + ". Must be 3 or higher.");
              }
            },
            
            "turn :onOrOff all the lights": function(onOrOff) {
              
              if (userTalking.priority > 4) {
                if (onOrOff === "on") {
                  // alert("Turning on all the lights.");
                  $.each($scope.house.rooms, function(room) {
                    $scope.house.rooms[room].light.on = true;                  
                  });
                  $scope.house.$save();
                  responsiveVoice.speak("Turning on all the lights.");

                } else if (onOrOff === "off") {
                  // alert("Turning off all the lights.");
                  $.each($scope.house.rooms, function(room) {
                    $scope.house.rooms[room].light.on = false;                  
                  });
                  $scope.house.$save();
                  responsiveVoice.speak("Turning off all the lights.");

                }
              } else {
                responsiveVoice.speak(userTalking.name + ". You have no authoritah! Must be 5.");
                // alert("You have no authoritah (must be 5)");
              }
            },
            
            "(set) (change) (make) (turn) (the) temperature (to) :deg (degrees)": function(deg) {
              
              if (userTalking.priority > 2) {
                if (parseInt(deg) > 54 && parseInt(deg) < 101) {
                  
                  
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].thermostat.on = true;
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].thermostat.temp = deg;
                  $scope.house.$save();                  
                  responsiveVoice.speak("Set the temperature to " + deg + " degrees.");
                  
                } else {                  
                  responsiveVoice.speak("Temperature range must be between 55 to 100 degrees.");
                }
              } else {
                responsiveVoice.speak("You have no authoritah! Must be 3 or higher.");
              }
              
            },
            
            "(set) (change) (make) (turn) (the) mode (to) :mode (mode)": function(mode) {
              
              if (userTalking.priority > 2) {
                if (mode === "study" || mode === "lock down" || mode === "party" || mode === "lockdown") {
                  
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].mode = mode;
                  $scope.house.$save();                  
                  responsiveVoice.speak("Setting the mode to " + mode);
                  
                } else {                  
                  responsiveVoice.speak("Check your mode and try again.");
                }
              } else {
                responsiveVoice.speak(userTalking.name + ". You have no authoritah! Must be 3 or higher.");
              }
              
            },
            
            "(set) (change) (make) (turn) (the) volume (to) :volume (percent)": function(volume) {
              
              volume = volume.replace("%", "");
              volume = parseInt(volume);
              console.log(volume);
              
              if (userTalking.priority > 2) {
                if (volume >= 0 && volume < 101) {
                  // alert("Setting the volume to " + volume);
                  
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].music.volume = volume;
                  $scope.house.$save();                  
                  responsiveVoice.speak("Setting the volume to " + volume + " percent");
                  
                } else {
                  responsiveVoice.speak("Check your volume and try again.");
                  // alert("Check your volume and try again.");
                }
              } else {
                responsiveVoice.speak(userTalking.name + ". You have no authoritah! Must be 3 or higher.");
                // alert("You have no authoritah! (must be 3 or higher)");
              }
              
            },
            
            "(set) (change) (make) (turn) (the) light color (to) *color": function(color) {            
              
              if (userTalking.priority > 2) {
                var originalColor = color;
                color = color.toLowerCase();
                color = color.replace(" ", "");
                
                console.log("New color: " + color);
                
                if (cssColors.hasOwnProperty(color)) {                  
                  
                  $scope.house.rooms[currentRoom.getAttribute("DBid")].light.color = cssColors[color];
                  $scope.house.$save();                  
                  responsiveVoice.speak("Light color set to " + originalColor);                                    
                  
                } else {
                  responsiveVoice.speak("Check your color and try again.");
                }
              } else {
                responsiveVoice.speak(userTalking.name + ". You have no authoritah! (must be 3 or higher)");
              }
            },        
            
            "play *artistOrSong": function(artistOrSong) {              
              if (artistOrSong === "Nickelback") {responsiveVoice.speak("How about no...");} else {
                responsiveVoice.speak("Playing " + artistOrSong);
              }
            },
            
            "order :number :units of *item": function(number, units, item) {
              responsiveVoice.speak("Ordered " + number + " " + units + " of " + item);
              
              fridgeRef.push().set(
                {name: item, quantity: number, units: units}
              );
              
            },
            
            "what's in the fridge": function() {
              $.each($scope.house.fridge, function(item) {
                
                responsiveVoice.speak($scope.house.fridge[item].quantity + " " + $scope.house.fridge[item].units + " of " + $scope.house.fridge[item].name);
              });
            },
            
            "say *phrase": function(phrase) {
              responsiveVoice.speak(phrase);
            },
            
            "what is the answer to (life) (the) (universe) (and) everything": function() {
              responsiveVoice.speak("The answer to life the universe and everything is 42.");
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
                //alert("Intruder alert! Interuder alert!");
                
                alarmInterval = setInterval(flashColor, 500);
                
                $("body").append("<button onclick=stopAlarm() class='coastclear'>Coast Clear</button>");
              }
              
              function flashColor() {

                $.each($scope.house.rooms, function(room) {
                  if($scope.house.rooms[room].alarm == 1) {
                    $scope.house.rooms[room].alarm = 2;
                  } else {
                    $scope.house.rooms[room].alarm = 1;
                  }
                });
                globalScope.house.$save();

              }
              
              if(event.target.getAttribute("occupants") !== null && event.target.getAttribute("occupants").indexOf($(ui.draggable)[0].getAttribute("id"))) {
                event.target.setAttribute("occupants", $.trim(event.target.getAttribute("occupants") + " " + $(ui.draggable)[0].getAttribute("id")));
                $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
                $scope.house.rooms[event.target.getAttribute("DBid")].light.on = true;
                $scope.house.$save();
              }
              else {
                event.target.setAttribute("occupants", $.trim($(ui.draggable)[0].getAttribute("id")));
                $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
                $scope.house.rooms[event.target.getAttribute("DBid")].light.on = true;
                $scope.house.$save();
              }              //event.target.style.backgroundColor = "yellow";
              console.log(event.target.getAttribute("occupants"));
            },
            out: function(event, ui) {
              var name = $(ui.draggable)[0].getAttribute("id");
              var index = event.target.getAttribute("occupants").indexOf(name);
              var occupants = event.target.getAttribute("occupants");
              occupants = occupants.slice(0,index) + occupants.slice(index+name.length);
              event.target.setAttribute("occupants", $.trim(occupants));
              $scope.house.rooms[event.target.getAttribute("DBid")].occupants = event.target.getAttribute("occupants");
              // check if there is still an occupant
              if(occupants === '') {
                console.log(event.target.id + " is empty. Turning off lights.");
                $scope.house.rooms[event.target.getAttribute("DBid")].light.on = false;
              }
              $scope.house.$save();
              console.log(event.target.getAttribute("occupants"));
            }
          });
        }
        
      }, 0);
    });
    
    var roomAlert = customAlert();
    $scope.roomClick = function(room) {
      // console.log("room: " + room);
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
      $("#source").val(room.music.source);
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
          
          document.getElementById('dialogboxfoot').innerHTML = '<button onclick="cancelAlert()">Cancel</button> <button onclick="dismissAlert()">OK</button>';
          
          currentRoom = room;
        }
      };
    } // end customAlert
    
    $scope.userClick = function(user, guid) {
      userTalking = user;
      userLocation(guid);
      // localStorage.userTalking = $(this).attr("name");
      // localStorage.userRoom = userLocation(this.id);  
      
      console.log("Starting Annyang");
      annyang.start();
      
      setTimeout(function() {
        console.log("Pausing annyang");
        annyang.abort();
      }, 6000);
    };
    
    function userLocation(guid) {
      // console.log("guid: " + guid);
      $(".room").each(function(num, room) {
        // console.log("ADAM: " + room.getAttribute("occupants").indexOf(guid));
        if(room.getAttribute("occupants").indexOf(guid) >= 0) {
          console.log("Setting current room: ");
          console.log(room);
          console.log("----------------------");
          currentRoom = room;
        }
      });
    }
    
    $scope.updateTemperature = function(val) {
      document.getElementById('temperature').textContent = val;
    };
    
  }]);
  
})();

var alarmInterval;

function updateTemperature(val) {
  document.getElementById('temperature').textContent = val;
}

function updateVolume(val) {
  document.getElementById('volume').textContent = val;
}

var dismissAlert = function() {
  
  // update firebase
  console.log("From dismissAlert:");
  
  console.log(currentRoom);
  
  currentRoom.mode = $("[name=mode]").val();
  
  // if (currentRoom.mode === "party") {
  //   
  //   var partyInterval = setInterval(changeColor, 300);
  //   
  // }
  
  currentRoom.light.on = $("#lightswitch").prop("checked");
  
  currentRoom.light.color = $("#light-color").val();
  
  currentRoom.thermostat.on = $("#thermostatswitch").prop("checked");
  if (currentRoom.thermostat.on) {
    
    currentRoom.thermostat.temp = $("#temp-slider").val();
  }
  
  currentRoom.music.on = $("#musicswitch").prop("checked");
  if (currentRoom.music.on) {
    currentRoom.music.volume = $("#volume-slider").val();
  }
  currentRoom.music.source = $("#source").val();
  globalScope.house.$save();
  document.getElementById('dialogbox').style.display = "none";
  document.getElementById('dialogoverlay').style.display = "none";
};

var cancelAlert = function() {
  document.getElementById('dialogbox').style.display = "none";
  document.getElementById('dialogoverlay').style.display = "none";
};

function stopAlarm() {
  clearInterval(alarmInterval);
  $.each(globalScope.house.rooms, function(room) {
    globalScope.house.rooms[room].alarm = 0;
  });
  $(".coastclear").hide();
  globalScope.house.$save();
}

function changeColor() {
  $("#" + currentRoom.id).css("background-color", randomColor());
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

var cssColors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
"cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
"darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
"darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
"darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
"firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
"gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
"honeydew":"#f0fff0","hotpink":"#ff69b4",
"indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
"lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
"lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
"lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
"magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
"mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
"navajowhite":"#ffdead","navy":"#000080",
"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
"palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
"red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
"saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
"tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
"violet":"#ee82ee",
"wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
"yellow":"#ffff00","yellowgreen":"#9acd32"};
