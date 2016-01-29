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
//         // annyang will capture anything after a splat (*) and pass it to the function.
// // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
// 'show me *tag': showFlickr,
//
// // A named variable is a one word variable, that can fit anywhere in your command.
// // e.g. saying "calculate October stats" will call calculateStats('October');
// 'calculate :month stats': calculateStats,
//
// // By defining a part of the following command as optional, annyang will respond
// // to both: "say hello to my little friend" as well as "say hello friend"
// 'say hello (to my little) friend': greeting
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
