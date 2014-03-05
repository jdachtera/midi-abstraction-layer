var MidiMessage = require('./MidiMessage');

function PolyphonicAftertouchMessage(channel, note, pressure) {
  this.channel = channel;
  this.note = note;
  this.pressure = pressure;
}

PolyphonicAftertouchMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xa0, buffer)) {
    return new PolyphonicAftertouchMessage(buffer[0] & 0x0F, buffer[1], buffer[2]);
  }
  return null;
};

PolyphonicAftertouchMessage.prototype.toBuffer = function() {
  return new Buffer([0xa0 & this.channel, this.note, this.pressure]);
};

module.exports = PolyphonicAftertouchMessage;