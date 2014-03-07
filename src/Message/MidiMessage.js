var midiCommon = require('midi-common');

function MidiMessage() {}

MidiMessage.validateBuffer = function(command, buffer) {
  return buffer && (
    (!midiCommon.commands[command].hasOwnProperty('dataLength') ||
    (buffer.length - 1 >= midiCommon.commands[command].dataLength)) &&
    (buffer[0] & command) === command);
};

MidiMessage.decodeData = function(buffer, startOffset, endOffset) {
  startOffset = startOffset || 0;
  endOffset = endOffset || buffer.length;

  var encodedLength = endOffset - startOffset;
      decodedLength = Math.ceil(encodedLength * 7 / 8),
      encodedIndex = 0,
      decodedIndex = 0;

  var decodedBuffer = new Buffer(decodedLength);

  for (encodedIndex = 0; encodedIndex < buffer.length - 1; encodedIndex += 2) {
    decodedBuffer[decodedIndex] = (buffer[encodedIndex] & 0x7F) | (buffer[encodedIndex + 1] << 7);
    decodedIndex++;
  }
  return decodedBuffer;
};

MidiMessage.readUInt14BE = function(buffer, offset) {
  return ((buffer[offset] & 0x7f) << 7) | (buffer[offset + 1] & 0x7f);
};

MidiMessage.writeUInt14BE = function(buffer, offset, value) {
  buffer[offset] = (0x7F & (value >> 7));
  buffer[offset + 1] = (0x7F & value);
};

MidiMessage.prototype.toString = function() {
  var string = '<Type: ' + this.messageType;
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      string += ' ' + key + ': ' + this[key];
    }
  }
  return string + '>';
};

module.exports = MidiMessage;

