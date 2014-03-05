var MidiMessage                 = require('./Message/MidiMessage'),
    NoteOffMessage              = require('./Message/NoteOffMessage'),
    NoteOnMessage               = require('./Message/NoteOnMessage'),
    PolyphonicAftertouchMessage = require('./Message/PolyphonicAftertouchMessage'),
    ControlChangeMessage        = require('./Message/ControlChangeMessage'),
    ProgramChangeMessage        = require('./Message/ProgramChangeMessage'),
    ChannelAftertouchMessage    = require('./Message/ChannelAftertouchMessage'),
    PitchBendMessage            = require('./Message/PitchBendMessage'),
    SystemExclusiveMessage      = require('./Message/SystemExclusiveMessage'),
    QuarterFrameMessage         = require('./Message/QuarterFrameMessage'),
    SongPositionMessage         = require('./Message/SongPositionMessage'),
    SongSelectMessage           = require('./Message/SongSelectMessage'),

    midiCommon                  = require('midi-common'),
    util                        = require('util'),
    Writable                    = require('stream').Writable
    ;


var defaultParsers = {
  0x80: NoteOffMessage,
  0x90: NoteOnMessage,
  0xa0: PolyphonicAftertouchMessage,
  0xb0: ControlChangeMessage,
  0xc0: ProgramChangeMessage,
  0xd0: ChannelAftertouchMessage,
  0xe0: PitchBendMessage,
  0xf0: SystemExclusiveMessage,
  0xf1: QuarterFrameMessage,
  0xf2: SongPositionMessage,
  0xf3: SongSelectMessage
};

var defaultSysExParsers = {

};

var Dissector = exports.Dissector = function Dissector(filter) {
  Writable.apply(this);
  this.parsers = Object.create(defaultParsers);
  this.sysExParsers = Object.create(defaultSysExParsers);
  this.filter = {};
  if (filter) {
    filter.forEach(function(command) {
      if (typeof(command) === 'string') {
        var value = null;
        for (var key in midiCommon.commands) {
          if ( midiCommon.commands.hasOwnProperty(key) && midiCommon.commands[key] &&  midiCommon.commands[key].name === command) {
            this.filter[key] = true;
          }
        }
      }
    }.bind(this));
  } else {
    for (var key in midiCommon.commands) {
      if (midiCommon.commands.hasOwnProperty(key)) {
        this.filter[key] = true;
      }
    }
  }
};

util.inherits(Dissector, Writable);

Dissector.addDefaultParser = function(command, parseFunc) {
    defaultParsers[command] = parseFunc;
};

Dissector.prototype.addParser = function(command, parseFunc) {
  this.parsers[command] = parseFunc;
};

Dissector.prototype.parse = function(buffer) {
  var command,
      type,
      Parser,
      message;

  if (!Buffer.isBuffer(buffer)) {
    buffer = new Buffer(buffer);
  }
  command = buffer[0];
  if (command & 0x80) {
    if (command < 0xf0) {
      command = 0xf0 & command;
    }

    if (!this.filter[command]) {
      return;
    }
    type = midiCommon.commands[command];
    Parser = this.parsers[command];

    if (type) {
      if (Parser) {
        message = Parser.parseBuffer(buffer, this);
        if (message) {
          this.emit(message.eventName || type.name, message);
          this.emit('message', message.eventName || type.name, message);
        }
      } else {
        this.emit(type.name, buffer);
        this.emit('message', type.name, buffer);
      }
    }

  }
};

Dissector.prototype.getSystemExlusiveParser = function(manufacturerId) {
  return this.sysExParsers[manufacturerId];
};

Dissector.prototype._write = function(chunk, encoding, callback) {
  this.parse(chunk);
  callback && callback();
};

