var MidiMessage = require('./MidiMessage');

function NoteOffMessage(channel, note, velocity) {
  this.channel = channel;
  this.note = note;
}

NoteOffMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0x80, buffer)) {
    return new NoteOffMessage(buffer[0] & 0x0F, buffer[1]);
  }
};

NoteOffMessage.prototype.toBuffer = function() {
  return new Buffer([0x80 & this.channel, this.note]);
};


module.exports = NoteOffMessage;
