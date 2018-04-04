'use strict';

const config = require('config');
const LogTransformStream = require('_/log-transform-stream');
const { createSourceStream, createTargetStream } = require('_/transport');

const transformer = new LogTransformStream({
    filters: {
        // types: ['INFO']
    }
});
const source = createSourceStream(config.get('source'));
const target = createTargetStream(config.get('target'));

source
    .pipe(transformer)
    // .pipe(target);
    .pipe(process.stdout);
