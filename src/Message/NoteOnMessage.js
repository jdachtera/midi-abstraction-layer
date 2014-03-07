var MidiMessage = require('./MidiMessage'),
  util = require('util');

function NoteOnMessage(channel, note, velocity) {
  this.channel = channel;
  this.note = note;
  this.velocity = velocity;
}

util.inherits(NoteOnMessage, MidiMessage);

NoteOnMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0x90, buffer)) {
    return new NoteOnMessage(buffer[0] & 0x0F, buffer[1], buffer[2]);
  }
  return null;
};

NoteOnMessage.prototype.messageType = 'noteOn';

NoteOnMessage.prototype.toBuffer = function() {
  return new Buffer([0x90 | (this.channel & 0x0f), this.note, this.velocity]);
};

module.exports = NoteOnMessage;