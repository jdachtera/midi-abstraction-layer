var midi = require('midi'),
    mal = require('../'),
    rtpmidi = require('rtpmidi');

var input = new midi.input(),
    output = new midi.output();

input.openVirtualPort("Test Input");
input.ignoreTypes(false, false, false);
output.openVirtualPort("Test Output");

var session = rtpmidi.manager.createSession({
  name: 'Network Session',
  port: 5006
});

session.connect({
  address: '127.0.0.1',
  port: 5004
});


var port = new mal.VirtualPort();


// Add some inputs and outputs to our virtual port
port.addInput(input);
port.addInput(session);
port.addOutput(output);
port.addOutput(session);

// Look what's coming in
port.input.on('message', function(message) {
  console.log('Received a message', message);
});


// Spy on the output
port.output.on('message', function(message) {
  console.log('Sending message: ', message.toString());
});

// Wait a few seconds until the network session is synchronized
setTimeout(function() {

  // Send some random system messages
  // See src/MessageGenerator.js
  port.output.reset();
  port.output.start();
  port.output.stop();
  port.output.continue();
  port.output.clock();

  // Play a nice melody
  var notes = [60, 62, 64, 65, 67, 69, 71, 72],
    i = 0;

  setInterval(function() {
    port.output.noteOff(0, notes[(notes.length + i - 1) % notes.length]);
    port.output.noteOn(0, notes[i], 127);
    i = (i + 1) % notes.length;
  }, 400);

}, 10000);










