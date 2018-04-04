'use strict';

const config = require('config');
const { createSourceStream, createTargetStream } = require('_/transport');

const source = createSourceStream(config.get('source'));
const target = createTargetStream(config.get('target'));

source.stream.pipe(target.stream);
