var mal = require('../src'),
    assert = require('assert');

describe('Dissector', function() {

  describe('#parse', function() {

    it('should parse a note off message', function(done) {
      var d = new mal.Dissector();
      d.on('noteOff', function(message)  {
        assert.equal(message.channel, 1, 'wrong channel');
        assert.equal(message.note, 0x60, 'wrong note value');
        done();
      });
      d.parse([0x81, 0x60]);
    });

    it('should parse a note on message', function(done) {
      var d = new mal.Dissector();
      d.on('noteOn', function(message)  {
        assert.equal(message.channel, 2, 'wrong channel');
        assert.equal(message.note, 0x60, 'wrong note value');
        assert.equal(message.velocity, 0x7f, 'wrong velocity value');
        done();
      });
      d.parse([0x92, 0x60, 0x7f]);
    });

    it('should parse a polyphonic aftertouch message', function(done) {
      var d = new mal.Dissector();
      d.on('polyphonicAftertouch', function(message)  {
        assert.equal(message.channel, 3, 'wrong channel');
        assert.equal(message.note, 0x60, 'wrong note value');
        assert.equal(message.pressure, 0x7f, 'wrong pressure value');
        done();
      });
      d.parse([0xa3, 0x60, 0x7f]);
    });

    it('should parse a control change message', function(done) {
      var d = new mal.Dissector();
      d.on('controlChange', function(message)  {
        assert.equal(message.channel, 4, 'wrong channel');
        assert.equal(message.control, 0x50, 'wrong control value');
        assert.equal(message.value, 0x04, 'wrong value value');
        done();
      });
      d.parse([0xb4, 0x50, 0x04]);
    });

    it('should parse a program change message', function(done) {
      var d = new mal.Dissector();
      d.on('programChange', function(message)  {
        assert.equal(message.channel, 4, 'wrong channel');
        assert.equal(message.program, 0x50, 'wrong program value');
        done();
      });
      d.parse([0xc4, 0x50]);
    });

    it('should parse a channel aftertouch message', function(done) {
      var d = new mal.Dissector();
      d.on('channelAftertouch', function(message)  {
        assert.equal(message.channel, 5, 'wrong channel');
        assert.equal(message.pressure, 0x50, 'wrong pressure value');
        done();
      });
      d.parse([0xd5, 0x50]);
    });

    it('should parse a pitch bend message', function(done) {
      var d = new mal.Dissector();
      d.on('pitchBend', function(message)  {
        assert.equal(message.channel, 5, 'wrong channel');
        assert.equal(message.pitch, 14751, 'wrong pitch value');
        done();
      });
      d.parse([0xe5, 0x73, 0x1f]);
    });

    it('should parse a system exclusive message', function(done) {
      var d = new mal.Dissector();
      d.on('systemExclusive', function(message)  {
        assert.equal(message.isExtended, true, 'did not recognize extended manufacturer id');
        assert.equal(message.manufacturerId, '003020', 'wrong manufacturer id');
        assert.equal(message.deviceId, 0x07, 'wrong device id');
        assert.equal(message.data.length, 2, 'wrong data length');
        assert.equal(message.data[0], 0x7f, 'wrong data value 1');
        assert.equal(message.data[1], 0x6f, 'wrong data value 2');
        done();
      });
      d.parse([0xf0, 0x00, 0x30, 0x20, 0x07, 0x7f, 0x6f, 0xf7]);
    });

    it('should parse a quarter frame message and apply to an smpte object', function(done) {
      var d = new mal.Dissector();
      var smtpe = {hours: 0, minutes: 0, seconds: 0, frames: 0, type: 0};

      var count = 0;

      d.on('quarterFrame', function(message)  {
        message.applyToSMTPE(smtpe);

        if (count === 7) {
          assert.equal(smtpe.hours, 17, 'wrong hours value');
          assert.equal(smtpe.minutes, 49, 'wrong minutes value');
          assert.equal(smtpe.seconds, 36, 'wrong seconds value');
          assert.equal(smtpe.frames, 20, 'wrong frames value');
          assert.equal(smtpe.type, 2, 'wrong type value');

          done();
        }
        count++;

      });
      d.parse([0xf1, parseInt('00000100', 2)]);
      d.parse([0xf1, parseInt('00010001', 2)]);

      d.parse([0xf1, parseInt('00100100', 2)]);
      d.parse([0xf1, parseInt('00110010', 2)]);

      d.parse([0xf1, parseInt('01000001', 2)]);
      d.parse([0xf1, parseInt('01010011', 2)]);

      d.parse([0xf1, parseInt('01100001', 2)]);
      d.parse([0xf1, parseInt('01111101', 2)]);
    });
  });

  it('should parse a song position message', function(done) {
    var d = new mal.Dissector();
    d.on('songPosition', function(message)  {
      assert.equal(message.position, 14751, 'wrong song position value');
      done();
    });
    d.parse([0xf2, 0x73, 0x1f]);
  });

  it('should parse a song select message', function(done) {
    var d = new mal.Dissector();
    d.on('songPosition', function(message)  {
      assert.equal(message.position, 14751, 'wrong song position value');
      done();
    });
    d.parse([0xf2, 0x73, 0x1f]);
  });

  it('should parse a tune request message', function(done) {
    var d = new mal.Dissector();
    d.on('tuneRequest', function(message)  {
      done();
    });
    d.parse([0xf6]);
  });

  it('should parse a clock message', function(done) {
    var d = new mal.Dissector();
    d.on('clock', function(message)  {
      done();
    });
    d.parse([0xf8]);
  });

  it('should parse a start message', function(done) {
    var d = new mal.Dissector();
    d.on('start', function(message)  {
      done();
    });
    d.parse([0xfa]);
  });

  it('should parse a continue message', function(done) {
    var d = new mal.Dissector();
    d.on('continue', function(message)  {
      done();
    });
    d.parse([0xfb]);
  });

  it('should parse a stop message', function(done) {
    var d = new mal.Dissector();
    d.on('stop', function(message)  {
      done();
    });
    d.parse([0xfc]);
  });

  it('should parse a active sensing message', function(done) {
    var d = new mal.Dissector();
    d.on('activeSensing', function(message)  {
      done();
    });
    d.parse([0xfe]);
  });

  it('should parse a system reset message', function(done) {
    var d = new mal.Dissector();
    d.on('reset', function(message)  {
      done();
    });
    d.parse([0xff]);
  });

});