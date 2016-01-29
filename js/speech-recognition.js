$(function() {
  $("#speech").click(function(){
    console.log("clicked");
    if (annyang) {
      // Let's define a command.

      console.log("Annyang activated.");

      var commands = {
        "hello": function() {
          alert('Hello world!');
          console.log("Hello there!");
        },
        "turn on all the lights": function() {
          alert("Turning on all the lights...");
          console.log("Turning on lights...");
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      console.log(annyang);

      annyang.debug();

      // Start listening.
      annyang.start();
      console.log("Annyang started...");

    }
  });
});
