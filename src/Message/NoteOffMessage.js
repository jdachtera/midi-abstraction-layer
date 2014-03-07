var MidiMessage = require('./MidiMessage'),
    util = require('util');

function NoteOffMessage(channel, note, velocity) {
  this.channel = channel;
  this.note = note;
}

util.inherits(NoteOffMessage, MidiMessage);

NoteOffMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0x80, buffer)) {
    return new NoteOffMessage(buffer[0] & 0x0F, buffer[1]);
  }
};

NoteOffMessage.prototype.messageType = 'noteOff';

NoteOffMessage.prototype.toBuffer = function() {
  return new Buffer([0x80 | (this.channel & 0x0f), this.note]);
};


module.exports = NoteOffMessage;
