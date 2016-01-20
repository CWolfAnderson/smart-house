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
  };

  // create users
  var users = [];

  // function userCreator(name, priority, posX, posY, ) {
  //
  // }

  var user = {
    id: 1,
    name: "",
    priority: 0,
    status: "resident", // enum: {friend, unknown, resident, restricted}
    posX: 0,
    posY: 0
  };


  // allows users to be dragged
  $(".draggable").draggable();

  $(".room").droppable({

    drop: function(event, ui) {
      // $(this)
      // .addClass( "ui-state-highlight" );
      console.log(event);
      console.log(ui);
      console.log("------");
      console.log(event.target);
      event.target.style.backgroundColor = "yellow";
    },
    out: function(event, ui) {

      // check if there is still an occupant
      var roomId = event.target.id;

      if (event.target.id === "bedroom1") {
        // alert("Bedroom 1");
      }

      event.target.style.backgroundColor = "white";
    }

  });

  $(".room").click(function(el) {
    // get room id & forward it to popup
    popUp(el.toElement.id);
  });

  // for pop-up
  function popUp(roomId){
	  
	  	  // get current room color
		  console.log("Room: " + roomId);
	  var roomColor = $("#" + roomId).backgroundColor;
	  console.log("Room color: " + roomColor);
	  
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var dialogoverlay = document.getElementById('dialogoverlay');
    var dialogbox = document.getElementById('dialogbox');
    dialogoverlay.style.display = "block";
    dialogoverlay.style.height = winH+"px";
    dialogbox.style.left = (winW/2) - (550 * 0.5) + "px";
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
        console.log("light is not black");
        $("#" + roomId).css("background-color", $("#light-color").val());

        // reset color of color picker
        $("#light-color").val("#000000");
      } else {
        console.log("light is black");
      }

      // check temperature

    };

  } // end popup
  

});
