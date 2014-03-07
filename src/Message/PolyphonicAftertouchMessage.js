var MidiMessage = require('./MidiMessage'),
  util = require('util');

function PolyphonicAftertouchMessage(channel, note, pressure) {
  this.channel = channel;
  this.note = note;
  this.pressure = pressure;
}

util.inherits(PolyphonicAftertouchMessage, MidiMessage);

PolyphonicAftertouchMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xa0, buffer)) {
    return new PolyphonicAftertouchMessage(buffer[0] & 0x0F, buffer[1], buffer[2]);
  }
  return null;
};

PolyphonicAftertouchMessage.prototype.messageType = 'polyphonicAftertouch';

PolyphonicAftertouchMessage.prototype.toBuffer = function() {
  return new Buffer([0xa0 | (this.channel & 0x0f), this.note, this.pressure]);
};

module.exports = PolyphonicAftertouchMessage;