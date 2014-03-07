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

    SystemMessage               = require('./Message/SystemMessage'),

    midiCommon                  = require('midi-common'),
    util                        = require('util'),
    Transform                   = require('stream').Transform
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

var MessageParser = module.exports = function MessageParser(filter) {
  Transform.call(this, {objectMode: true});
  this.parsers = Object.create(defaultParsers);
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

util.inherits(MessageParser, Transform);

MessageParser.addDefaultParser = function(command, parseFunc) {
    defaultParsers[command] = parseFunc;
};

MessageParser.prototype.addParser = function(command, parseFunc) {
  this.parsers[command] = parseFunc;
};

MessageParser.prototype.parse = function(buffer) {
  var command,
      type,
      typeName,
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

    if (!Parser && command > 0xf3) {
      Parser = SystemMessage;
    }

    if (!type) {
      typeName = 'unknown';
    } else {
      typeName = type.name;
    }

    if (Parser) {
      message = Parser.parseBuffer(buffer, this);
    }

    if (!message) {
      message = {buffer: buffer};
    }
    message.messageType = message.messageType || typeName;
    return message;

  }
};

MessageParser.prototype._transform = function(chunk, encoding, callback) {
  var message = this.parse(chunk);

  if (!!message) {
    this.push(message);
    this.emit(message.messageType, message);
    this.emit('message', message);
  }
  callback && callback();
};

