var mal = require('../src'),
    assert = require('assert');

describe('Dissector', function() {

  var d = new mal.Dissector();

  describe('#parse', function() {

    it('should parse a note off message', function() {
      var message = d.parse([0x81, 0x60]);
      assert.equal(message.messageType, 'noteOff', 'wrong message type');
      assert.equal(message.channel, 1, 'wrong channel');
      assert.equal(message.note, 0x60, 'wrong note value');

    });

    it('should parse a note on message', function() {
      var message = d.parse([0x92, 0x60, 0x7f]);
      assert.equal(message.messageType, 'noteOn', 'wrong message type');
      assert.equal(message.channel, 2, 'wrong channel');
      assert.equal(message.note, 0x60, 'wrong note value');
      assert.equal(message.velocity, 0x7f, 'wrong velocity value');
    });

    it('should parse a polyphonic aftertouch message', function() {
      var message = d.parse([0xa3, 0x60, 0x7f]);
      assert.equal(message.messageType, 'polyphonicAftertouch', 'wrong message type');
      assert.equal(message.channel, 3, 'wrong channel');
      assert.equal(message.note, 0x60, 'wrong note value');
      assert.equal(message.pressure, 0x7f, 'wrong pressure value');
    });

    it('should parse a control change message', function() {
      var message = d.parse([0xb4, 0x50, 0x04]);
      assert.equal(message.messageType, 'controlChange', 'wrong message type');
      assert.equal(message.channel, 4, 'wrong channel');
      assert.equal(message.control, 0x50, 'wrong control value');
      assert.equal(message.value, 0x04, 'wrong value value');
    });

    it('should parse a program change message', function() {
      var message = d.parse([0xc4, 0x50]);
      assert.equal(message.messageType, 'programChange', 'wrong message type');
      assert.equal(message.channel, 4, 'wrong channel');
      assert.equal(message.program, 0x50, 'wrong program value');
    });

    it('should parse a channel aftertouch message', function() {
      var message = d.parse([0xd5, 0x50]);
      assert.equal(message.messageType, 'channelAftertouch', 'wrong message type');
      assert.equal(message.channel, 5, 'wrong channel');
      assert.equal(message.pressure, 0x50, 'wrong pressure value');
    });

    it('should parse a pitch bend message', function() {
      var message = d.parse([0xe5, 0x73, 0x1f]);
      assert.equal(message.messageType, 'pitchBend', 'wrong message type');
      assert.equal(message.channel, 5, 'wrong channel');
      assert.equal(message.pitch, 14751, 'wrong pitch value');
    });

    it('should parse a system exclusive message', function() {
      var message = d.parse([0xf0, 0x00, 0x30, 0x20, 0x07, 0x7f, 0x6f, 0xf7]);
      assert.equal(message.messageType, 'systemExclusive', 'wrong message type');
      assert.equal(message.isExtended, true, 'did not recognize extended manufacturer id');
      assert.equal(message.manufacturerId, '003020', 'wrong manufacturer id');
      assert.equal(message.deviceId, 0x07, 'wrong device id');
      assert.equal(message.data.length, 2, 'wrong data length');
      assert.equal(message.data[0], 0x7f, 'wrong data value 1');
      assert.equal(message.data[1], 0x6f, 'wrong data value 2');
    });

    it('should parse 8 quarter frame messages in sequence and correctly apply them to an smpte object', function() {
      var smtpe = {hours: 0, minutes: 0, seconds: 0, frames: 0, type: 0};

      [
        '00000100',
        '00010001',
        '00100100',
        '00110010',
        '01000001',
        '01010011',
        '01100001',
        '01111101'
      ].forEach(function(binaryMessage) {
        var message = d.parse([0xf1, parseInt(binaryMessage, 2)]);
        assert.equal(message.messageType, 'quarterFrame', 'wrong message type');
        message.applyToSMTPE(smtpe);
      });

      assert.equal(smtpe.hours, 17, 'wrong hours value');
      assert.equal(smtpe.minutes, 49, 'wrong minutes value');
      assert.equal(smtpe.seconds, 36, 'wrong seconds value');
      assert.equal(smtpe.frames, 20, 'wrong frames value');
      assert.equal(smtpe.type, 2, 'wrong type value');

    });
  });

  it('should parse a song position message', function() {
    var message = d.parse([0xf2, 0x73, 0x1f]);
    assert.equal(message.messageType, 'songPosition', 'wrong message type');
    assert.equal(message.position, 14751, 'wrong song position value');
  });

  it('should parse a song select message', function() {
    var message = d.parse([0xf3, 0x73]);
    assert.equal(message.messageType, 'songSelect', 'wrong message type');
    assert.equal(message.value, 0x73, 'wrong song value');
  });

  it('should parse a tune request message', function() {
    var message = d.parse([0xf6]);
    assert.equal(message.messageType, 'tuneRequest', 'wrong message type');
  });

  it('should parse a clock message', function() {
    var message = d.parse([0xf8]);
    assert.equal(message.messageType, 'clock', 'wrong message type');
  });

  it('should parse a start message', function() {
    var message = d.parse([0xfa]);
    assert.equal(message.messageType, 'start', 'wrong message type');
  });

  it('should parse a continue message', function() {
    var message = d.parse([0xfb]);
    assert.equal(message.messageType, 'continue', 'wrong message type');
  });

  it('should parse a stop message', function() {
    var message = d.parse([0xfc]);
    assert.equal(message.messageType, 'stop', 'wrong message type');
  });

  it('should parse a active sensing message', function() {
    var message = d.parse([0xfe]);
    assert.equal(message.messageType, 'activeSensing', 'wrong message type');
  });

  it('should parse a system reset message', function() {
    var message = d.parse([0xff]);
    assert.equal(message.messageType, 'reset', 'wrong message type');
  });

});