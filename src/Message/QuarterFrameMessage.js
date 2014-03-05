var MidiMessage = require('./MidiMessage');

function QuarterFrameMessage(data) {
  this.data = data;
}

QuarterFrameMessage.parseBuffer = function(buffer) {
  if (MidiMessage.validateBuffer(0xf1, buffer)) {
    return new QuarterFrameMessage(buffer[1]);
  }
};

QuarterFrameMessage.prototype.tobuffer = function() {
  return new Buffer([0xf1, this.data]);
};

QuarterFrameMessage.prototype.applyToSMTPE = function(smtpe) {
  var type = (this.data >> 4) & 0x7,
    nibble = this.data & 0x0f,
    operator;

  if (type % 2 === 0) {
    // Low nibble
    operator = 0xf0;
  } else {
    // High nibble
    nibble = nibble << 4;
    operator = 0x0f;
  }

  switch(type) {
    case 0:
    case 1:
      smtpe.frames = smtpe.frames & operator | nibble;
      break;
    case 2:
    case 3:
      smtpe.seconds = smtpe.seconds & operator | nibble;
      break;
    case 4:
    case 5:
      smtpe.minutes = smtpe.minutes & operator | nibble;
      break;
    case 6:
      smtpe.hours = smtpe.hours & operator | nibble;
      break;
    case 7:
      smtpe.type = (nibble >> 5) & 0x3;
      nibble = nibble & 0x10;
      smtpe.hours = smtpe.hours & operator | nibble;
      break;
  }

};

module.exports = QuarterFrameMessage;
