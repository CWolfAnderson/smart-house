$(function() {

  function updateTemperature(value) {
    console.log(value);
  }

  // create rooms
  var rooms = [];

  var room = {
    name: "",
    occupants: [],
    temp: "",
    music: {on: false, source: "", volume: 0},
    light: {on: false, color: "", intensity: 0}
    // possibly blinds
  };

  // create users
  var users = [];

  // function userCreator(name, priority, posX, posY, ) {
  //
  // }

  var user = {
    id: 1,
    name: "",
    priority: 0, // 0 - 10
    status: "resident", // enum: {friend, unknown, resident, restricted}
    location: "", // roomId, outside, or away
    posX: 0,
    posY: 0
  };

  // allow popover
  $('[data-toggle="popover"]').popover({html: true});

  $(".room").droppable({

    drop: function(event, ui) {
      // $(this)
      // .addClass( "ui-state-highlight" );

      //change the occupants attribute to track who's in what place.
      if(event.target.getAttribute("occupants") !== null) {
        event.target.setAttribute("occupants", event.target.getAttribute("occupants") + " " + $(ui.draggable)[0].getAttribute("id"));
      }
      else {
        event.target.setAttribute("occupants", $(ui.draggable)[0].getAttribute("id"));
      }

      event.target.style.backgroundColor = "yellow";
    },
    out: function(event, ui) {
      //leaves some random spaces but unless you're moving several thousand dudes in and out it's no problem.
      var name = $(ui.draggable)[0].getAttribute("id");
      var index = event.target.getAttribute("occupants").indexOf(name);
      var occupants = event.target.getAttribute("occupants");
      occupants = occupants.slice(0,index) + occupants.slice(index+name.length);
      event.target.setAttribute("occupants", occupants);
      // check if there is still an occupant
      if($.trim(occupants) === '') {
        event.target.style.backgroundColor = "white";
      }

    }

  });

  $(".room").click(function(el) {
    // get room id & forward it to popup
    popUp(el.toElement.id);
  });

  // for pop-up
  function popUp(roomId){

    // get & set current room color
    var roomColor = $("#" + roomId).css('backgroundColor');
    $("#light-color").val(roomColor);

    // get current temperature
    var currTemp = $("#" + roomId + " > .temp-display").val();
    $("#temp-slider").val(currTemp);

    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var dialogoverlay = document.getElementById('dialogoverlay');
    var dialogbox = document.getElementById('dialogbox');
    dialogoverlay.style.display = "block";
    dialogoverlay.style.height = winH + "px";
    dialogbox.style.left = (winW / 2) - (550 * 0.5) + "px";
    dialogbox.style.top = "100px";
    dialogbox.style.display = "block";
    document.getElementById('dialogboxhead').innerHTML = roomId;
    document.getElementById('dialogboxfoot').innerHTML = '<button onclick="ok()">OK</button>';

    this.ok = function(){

      // remove pop-up
      document.getElementById('dialogbox').style.display = "none";
      document.getElementById('dialogoverlay').style.display = "none";

      // check mode
      console.log($("#mode"));
      console.log($("#mode").val());

      // check light color""
      console.log($("#light-color").val());

      if ($("#light-color").val() != "#000000") { // if light color is not black
        $("#" + roomId).css("background-color", $("#light-color").val());

        // reset color of color picker
        $("#light-color").val("#000000");
      } else {
        console.log("light is black");
      }

      // check temperature
      if ($("#temp-slider").val() !== "") {
        $("#" + roomId + " > .temp-display").html("<p class=temp-display>" + $("#temp-slider").val() + "&deg;</p>");
      }

    };

  } // end popup


});
