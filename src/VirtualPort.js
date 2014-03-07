var MessageGenerator    = require('./MessageGenerator'),
    MessageParser       = require('./MessageParser'),
    MidiInputWrapper    = require('./Wrapper/MidiInputWrapper');

function VirtualPort(inputFilter) {
  this.input = new MessageParser(inputFilter);
  this.output = new MessageGenerator();
  this._handleMessage = this._handleMessage.bind(this);
  this._outputs = [];
  this.output.on('message', function(message) {
    var data = Array.prototype.slice.call(message.toBuffer(), 0);
    this._outputs.forEach(function(output) {
      output.sendMessage(data);
    });
  }.bind(this));
}

VirtualPort.prototype._handleMessage = function(deltaTime, message) {
  this.input.write(message);
};

VirtualPort.prototype.addInput = function(input) {
  new MidiInputWrapper(input).pipe(this.input)
};

VirtualPort.prototype.removeInput = function(input) {
  MidiInputWrapper.unpipe(input, this.input);
};

VirtualPort.prototype.addOutput = function(output) {
  this._outputs.push(output);
};

VirtualPort.prototype.removeOutput = function(output) {
  this._outputs.slice(this.outputs.indexOf(output));
};


module.exports = VirtualPort;