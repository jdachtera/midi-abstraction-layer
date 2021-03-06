var MidiMessage = require('./MidiMessage'),
    midiCommon = require('midi-common'),
  util = require('util');

function SystemExclusiveMessage(manufacturerId, deviceId, data) {
  if (typeof(manufacturerId) === 'string') {

    this.isExtended = true;
    this.manufacturerId = manufacturerId;
  } else {
    this.isExtended = false;
    this.manufacturerId = manufacturerId;
  }

  this.deviceId = deviceId;
  this.data = data;
}

util.inherits(SystemExclusiveMessage, MidiMessage);

SystemExclusiveMessage.parseBuffer = function(buffer, dissector) {
  if (MidiMessage.validateBuffer(0xf0, buffer)) {
    var isExtended,
        manufacturerId,
        deviceId,
        offset,
        dataLength = 0;

    if (buffer[1] === 0) {
      isExtended = true;
      manufacturerId = buffer.readUInt16BE(2).toString(16);
      while (manufacturerId.length < 6) {
        manufacturerId = '0' + manufacturerId;
      }
    } else {
      manufacturerId = buffer[1];
    }
    offset = isExtended ? 5 : 3;
    deviceId = buffer[offset -1];
    while (offset + dataLength < buffer.length && buffer[offset + dataLength] != 0xf7) {
      dataLength++;
    }
    data = dataLength ? buffer.slice(offset, offset + dataLength) : null;
    return new SystemExclusiveMessage(manufacturerId, deviceId, data);
  }

};

SystemExclusiveMessage.prototype.messageType = 'systemExclusive';

SystemExclusiveMessage.prototype.getManufacturerName = function() {
  var manufacturer = midiCommon.systemExclusive[this.manufacturerId];
  return manufacturer && manufacturer.name || manufacturer;
};

SystemExclusiveMessage.prototype.toBuffer = function() {
  var offset,
      buffer,
      i,
      dataLength = this.data ? this.dataLength : 0;

  if (this.isExtended) {
    buffer = new Buffer(dataLength + 6);
    buffer[1] = 0;
    buffer.writeUInt16LE(parseInt(this.manufacturerId, 16), 2);
    offset = 4
  } else {
    buffer = new Buffer(dataLength + 4);
    offset = 2
  }

  buffer[0] = 0xf0;
  buffer[offset] = deviceId;
  for (i = 0; i < dataLength; i++) {
    buffer[i + offset] = this.data[i];
  }

  buffer[buffer.length - 1] = 0xf7;
  return buffer;
};

module.exports = SystemExclusiveMessage;
