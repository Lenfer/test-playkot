var fs = require('fs');
var util = require('util');
var Abstract = require('./abstract');

function FileTarget(config) {
  this.config = config;
  this.stream = fs.createWriteStream(this.config.path, {
    flags: 'w',
    encoding: 'utf8',
  });
}
util.inherits(FileTarget, Abstract);

module.exports = FileTarget;
