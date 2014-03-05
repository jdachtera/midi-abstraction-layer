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
  0x80: NoteOffMessage.parseBuffer,
  0x90: NoteOnMessage.parseBuffer,
  0xa0: PolyphonicAftertouchMessage.parseBuffer,
  0xb0: ControlChangeMessage.parseBuffer,
  0xc0: ProgramChangeMessage.parseBuffer,
  0xd0: ChannelAftertouchMessage.parseBuffer,
  0xe0: PitchBendMessage.parseBuffer,
  0xf0: SystemExclusiveMessage.parseBuffer,
  0xf1: QuarterFrameMessage.parseBuffer,
  0xf2: SongPositionMessage.parseBuffer,
  0xf3: SongSelectMessage.parseBuffer
};

var defaultSysExParsers = {

};

var Dissector = exports.Dissector = function Dissector(filter) {
  Writable.apply(this);
  this.parsers = Object.create(defaultParsers);
  this.filter = {};
  if (filter) {
    filter.forEach(function(command) {
      if (util.isString(command)) {
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

  this.on('systemExclusive', this.handleSystemExclusiveMessage.bind(this));
};

util.inherits(Dissector, Writable);

Dissector.addDefaultParser = function(command, parseFunc) {
    defaultParsers[command] = parseFunc;
};

Dissector.prototype.addParser = function(command, parseFunc) {
  this.parsers[command] = parseFunc;
};

Dissector.prototype.parse = function(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    buffer = new Buffer(buffer);
  }
  var command = buffer[0];
  if (command & 0x80) {
    if (command < 0xf0) {
      command = 0xF0 & command;
    }

    if (!this.filter[command]) {
      return;
    }
    var type = midiCommon.commands[command],
        parseFunc = this.parsers[command];

    if (type) {

      if (parseFunc) {
        var message = parseFunc(buffer);
        if (message) {
          this.emit(type.name, message);
        }
      } else {
        this.emit(type.name, buffer)
      }
    }
  }
};

Dissector.prototype.handleSystemExclusiveMessage = function(message) {

};

Dissector.prototype._write = function(chunk, encoding, callback) {
  this.parse(chunk);
  callback && callback();
};

