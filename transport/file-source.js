var fs = require('fs');
var util = require('util');
var Abstract = require('./abstract');

function FileSource(config) {
  this.config = config;
  this.stream = fs.createReadStream(this.config.path, {
    flags: 'r',
    encoding: 'utf8',
  });
}
util.inherits(FileSource, Abstract);

module.exports = FileSource;
