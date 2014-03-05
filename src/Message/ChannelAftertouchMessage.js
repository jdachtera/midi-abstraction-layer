var MidiMessage = require('./MidiMessage');

function ChannelAftertouchMessage(channel, pressure, velocity) {
  this.channel = channel;
  this.pressure = pressure;
}

ChannelAftertouchMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xd0, buffer)) {
    return new ChannelAftertouchMessage(buffer[0] & 0x0F, buffer[1]);
  }
  return null;
};

ChannelAftertouchMessage.prototype.toBuffer = function() {
  return new Buffer([0xd0 & this.channel, this.pressure]);
};

module.exports = ChannelAftertouchMessage;

