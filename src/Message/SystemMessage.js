var midiCommon                  = require('midi-common'),
    MidiMessage = require('./MidiMessage'),
    util = require('util');

function SystemMessage(command) {
  this,command = command;
  this.messageType =  midiCommon.commands[command] && midiCommon.commands[command].name || 'unknown';
}

util.inherits(SystemMessage, MidiMessage);

SystemMessage.parseBuffer = function(buffer) {
  if (buffer.length && buffer[0] > 0xf3) {
    return new SystemMessage(buffer[0]);
  }
};

SystemMessage.prototype.toBuffer = function() {
  return new Buffer(this.command);
};
