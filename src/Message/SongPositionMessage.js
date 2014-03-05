var MidiMessage = require('./MidiMessage');

function SongPositionMessage(position) {
  this.position = position;
}

SongPositionMessage.parseBuffer = function(buffer) {
  var position;
  if (MidiMessage.validateBuffer(0xf2, buffer)) {
    position = MidiMessage.readUInt14BE(buffer, 1);
    return new SongPositionMessage(position);
  }
};

SongPositionMessage.prototype.toBuffer = function() {
  var buffer = new Buffer(3);
  MidiMessage.writeUInt14BE(buffer, 1, this.position);
  return buffer;
};

module.exports = SongPositionMessage;
