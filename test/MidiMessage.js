var MidiMessage = require('../src/Message/MidiMessage'),
    assert = require('assert');


describe('MidiMessage', function() {
  describe('#readUInt14BE', function() {

    it('should read 14bit integer', function() {
      var encoded = new Buffer([parseInt('01110011', 2), parseInt('00011111', 2)]);
      var decoded = MidiMessage.readUInt14BE(encoded, 0);
      var expected = parseInt('011100110011111', 2);
      assert.equal(decoded, expected, 'wrong 14 bit value');
    });
  });

  describe('#writeUInt14BE', function() {
    it('should write 14bit integer', function() {
      var buffer = new Buffer(2);
      var encoded = MidiMessage.writeUInt14BE(buffer, 0, parseInt('011100110011111', 2));
      assert.equal(buffer[0], parseInt('01110011', 2), 'wrong msb value');
      assert.equal(buffer[1], parseInt('00011111', 2), 'wrong lsb value');
    });
  });

  describe('#validateBuffer', function() {
    it('should validate the buffers command byte and length', function() {
      assert.equal(MidiMessage.validateBuffer(0x90, new Buffer([0x91, 0x71, 0x71])), true, 'correct buffer is reported as incorrect');
      assert.equal(MidiMessage.validateBuffer(0x90, new Buffer([0x91, 0x71])), false, 'incorrect buffer is reported as correct');
    });
  });


});

