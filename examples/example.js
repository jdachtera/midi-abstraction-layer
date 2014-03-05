var midi = require('midi'),
    mal = require('../');

var input = new midi.input();

input.openVirtualPort("Test Input");
input.ignoreTypes(false, false, false);

var dissector = new mal.Dissector();

midi.createReadStream(input).pipe(dissector);

dissector.on('systemExclusive', function(message) {
  console.log(message.getManufacturerName(), message);
});


