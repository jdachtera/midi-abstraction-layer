var Transform = require('stream').Transform,
    util = require('util');

function BufferArrayTransform(stream) {
  Transform.call(this, {objectMode: true});
  stream.pipe(this);
}

util.inherits(BufferArrayTransform, Transform);

BufferArrayTransform.prototype._transform = function(chunk, encoding, callback) {
  this.push(Array.prototype.slice.call(chunk, 0));
  callback();
};

module.exports = BufferArrayTransform;
