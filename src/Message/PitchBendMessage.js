var MidiMessage = require('./MidiMessage');

function PitchBendMessage(channel, pitch) {
  this.channel = channel;
  this.pitch = pitch;
}

PitchBendMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xe0, buffer)) {
    return new PitchBendMessage(buffer[0] & 0x0F, MidiMessage.readUInt14BE(buffer, 1));
  }
  return null;
};

PitchBendMessage.prototype.toBuffer = function() {
  var buffer = new buffer(3);
  buffer[0] = 0xe0 | (this.channel & 0x0f);
  MidiMessage.writeUInt14BE(buffer, 1, this.pitch);
  return buffer;
};


module.exports = PitchBendMessage;