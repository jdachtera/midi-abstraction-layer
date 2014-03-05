var util = require('util'),
    midiCommon = require('midi-common');

exports.validateBuffer = function(command, buffer) {
  return buffer && (
    (!midiCommon.commands[command].hasOwnProperty('dataLength') ||
    (buffer.length - 1 >= midiCommon.commands[command].dataLength)) &&
    (buffer[0] & command) === command);
};

exports.decodeData = function(buffer, startOffset, endOffset) {
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

exports.readUInt14BE = function(buffer, offset) {
  return ((buffer[offset] & 0x7f) << 7) | (buffer[offset + 1] & 0x7f);
};

exports.writeUInt14BE = function(buffer, offset, value) {
  buffer[offset] = (0x7F & (value >> 7));
  buffer[offset + 1] = (0x7F & value);
};

