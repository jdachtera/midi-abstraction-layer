var MidiMessage = require('./MidiMessage');

function ProgramChangeMessage(channel, program, velocity) {
  this.channel = channel;
  this.program = program;
}

ProgramChangeMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xc0, buffer)) {
    return new ProgramChangeMessage(buffer[0] & 0x0F, buffer[1]);
  }
  return null;
};

ProgramChangeMessage.prototype.toBuffer = function() {
  return new Buffer([0xc0 & this.channel, this.program]);
};

module.exports = ProgramChangeMessage;

