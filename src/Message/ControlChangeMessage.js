var MidiMessage = require('./MidiMessage'),
  util = require('util');

function ControlChangeMessage(channel, control, value) {
  this.channel = channel;
  this.control = control;
  this.value = value;
}

util.inherits(ControlChangeMessage, MidiMessage);

ControlChangeMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xb0, buffer)) {
    return new ControlChangeMessage(buffer[0] & 0x0F, buffer[1], buffer[2]);
  }
  return null;
};

ControlChangeMessage.prototype.messageType = 'controlChange';

ControlChangeMessage.prototype.toBuffer = function() {
  return new Buffer([0xb0 | (this.channel & 0x0f), this.control, this.value]);
};

module.exports = ControlChangeMessage;