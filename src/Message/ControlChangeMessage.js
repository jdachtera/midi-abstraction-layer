var MidiMessage = require('./MidiMessage');

function ControlChangeMessage(channel, control, value) {
  this.channel = channel;
  this.control = control;
  this.value = value;
}

ControlChangeMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xb0, buffer)) {
    return new ControlChangeMessage(buffer[0] & 0x0F, buffer[1], buffer[2]);
  }
  return null;
};

ControlChangeMessage.prototype.toBuffer = function() {
  return new Buffer([0xb0 & this.channel, this.control, this.value]);
};

module.exports = ControlChangeMessage;