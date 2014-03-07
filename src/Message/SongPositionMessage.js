var MidiMessage = require('./MidiMessage'),
  util = require('util');

function SongPositionMessage(position) {
  this.position = position;
}

util.inherits(SongPositionMessage, MidiMessage);

SongPositionMessage.parseBuffer = function(buffer) {
  var position;
  if (MidiMessage.validateBuffer(0xf2, buffer)) {
    position = MidiMessage.readUInt14BE(buffer, 1);
    return new SongPositionMessage(position);
  }
};

SongPositionMessage.prototype.messageType = 'songPosition';

SongPositionMessage.prototype.toBuffer = function() {
  var buffer = new Buffer(3);
  MidiMessage.writeUInt14BE(buffer, 1, this.position);
  return buffer;
};

module.exports = SongPositionMessage;
