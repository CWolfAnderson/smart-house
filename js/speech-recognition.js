$(function() {

  $(".user").dblclick(function(){
    console.log("clicked");
    if (annyang) {
      // Let's define a command.

      console.log("Annyang activated.");

      var commands = {
        "hey jose": function() {
          alert("I am Jose. I am at your service.");
        },

        "hello": function() {
          alert('Hello world!');
          console.log("Hello there!");
        },

        "turn on all the lights": function() {
          alert("Turning on all the lights...");
          console.log("Turning on lights...");
        },

        // annyang will capture anything after a splat (*) and pass it to the function.
        // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
        'show me *tag': function(tag) {
          var url = 'http://api.flickr.com/services/rest/?tags=' + tag;
          $.getJSON(url);
        },

        // A named variable is a one word variable, that can fit anywhere in your command.
        // e.g. saying "calculate October stats" will call calculateStats('October');
        'calculate :month stats': function(month) {
          $('#stats').text('Statistics for '+month);
        },

        "turn on (the) :room lights": function(roomName) {
          alert("Turning on the " + roomName + " lights.");
        },

        // special case for living room
        "turn on (the) living room lights": function() {
          alert("Turning on the living room lights");
        },

        // By defining a part of the following command as optional, annyang will respond
        // to both: "say hello to my little friend" as well as "say hello friend"
        'say hello (to my little) friend': function() {
          $('#greeting').text('Hello!');
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      annyang.debug();

      // Start listening.
      annyang.start();
      console.log("Annyang started.");

    }
  });
});
