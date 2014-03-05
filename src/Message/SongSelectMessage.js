var MidiMessage = require('./MidiMessage');

function SongSelectMessage(songNumber) {
  this.songNumber = songNumber;
}

SongSelectMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xf3, buffer)) {
    return new SongSelectMessage(buffer[1] & 0x0F);
  }
};

SongSelectMessage.prototype.toBuffer = function() {
  return new Buffer([0xf3, this.songNumber & 0x0f]);
};

module.exports = SongSelectMessage;
