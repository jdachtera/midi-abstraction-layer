var MidiMessage = require('./MidiMessage'),
  util = require('util');

function ProgramChangeMessage(channel, program) {
  this.channel = channel;
  this.program = program;
}

util.inherits(ProgramChangeMessage, MidiMessage);

ProgramChangeMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xc0, buffer)) {
    return new ProgramChangeMessage(buffer[0] & 0x0F, buffer[1]);
  }
  return null;
};

ProgramChangeMessage.prototype.messageType = 'programChange';

ProgramChangeMessage.prototype.toBuffer = function() {
  return new Buffer([0xc0 | (this.channel & 0x0f), this.program]);
};

module.exports = ProgramChangeMessage;

