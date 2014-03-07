var util = require('util'),
    Readable = require('stream').Readable;

function MidiInputWrapper(input) {
  Readable.call(this, {objectMode: true});
  this._handleMessage = this._handleMessage.bind(this);
  this.input = input;
  input.on('message', this._handleMessage);
  MidiInputWrapper.instances.push(this);
}

util.inherits(MidiInputWrapper, Readable);

MidiInputWrapper.instances = [];
MidiInputWrapper.unpipe = function(input, destination) {
  this.instances.forEach(function(instance) {
    if (instance.input === input) {
      input.removeEventListener('message', this._handleMessage);
      input.unpipe(destination);
    }
  }.bind(this));
};

MidiInputWrapper.prototype._handleMessage = function(deltaTime, message) {
  if (deltaTime) {
    setTimeout(function() {
      this.push(message);
    }.bind(this), deltaTime);
  } else {
    this.push(message);
  }
};

MidiInputWrapper.prototype._read = function() {
  this.readable = true;
};

module.exports = MidiInputWrapper;


