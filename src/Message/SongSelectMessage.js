var MidiMessage = require('./MidiMessage');

function SongSelectMessage(songNumber) {
  this.value = songNumber;
}

SongSelectMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xf3, buffer)) {
    return new SongSelectMessage(buffer[1] & 0x7F);
  }
};

SongSelectMessage.prototype.toBuffer = function() {
  return new Buffer([0xf3, this.value & 0x7f]);
};

module.exports = SongSelectMessage;
