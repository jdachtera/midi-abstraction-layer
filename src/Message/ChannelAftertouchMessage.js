var MidiMessage = require('./MidiMessage'),
  util = require('util');

function ChannelAftertouchMessage(channel, pressure) {
  this.channel = channel;
  this.pressure = pressure;
}

util.inherits(ChannelAftertouchMessage, MidiMessage);

ChannelAftertouchMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xd0, buffer)) {
    return new ChannelAftertouchMessage(buffer[0] & 0x0F, buffer[1]);
  }
  return null;
};

ChannelAftertouchMessage.prototype.messageType = 'channelAftertouch';

ChannelAftertouchMessage.prototype.toBuffer = function() {
  return new Buffer([0xd0 | (this.channel & 0x0f), this.pressure]);
};

module.exports = ChannelAftertouchMessage;

