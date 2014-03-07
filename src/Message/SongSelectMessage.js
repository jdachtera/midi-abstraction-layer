var MidiMessage = require('./MidiMessage'),
  util = require('util');

function SongSelectMessage(song) {
  this.song = song;
}

util.inherits(SongSelectMessage, MidiMessage);

SongSelectMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xf3, buffer)) {
    return new SongSelectMessage(buffer[1] & 0x7F);
  }
};

SongSelectMessage.prototype.messageType = 'songSelect';

SongSelectMessage.prototype.toBuffer = function() {
  return new Buffer([0xf3, this.song & 0x7f]);
};

module.exports = SongSelectMessage;
