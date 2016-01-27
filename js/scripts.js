$(function() {

  function updateTemperature(value) {
    console.log(value);
  }

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

});
