'use strict';

const config = require('config');
const LogTransformStream = require('_/log-transform-stream');
const { createSourceStream, createTargetStream } = require('_/transport');


const transformer = new LogTransformStream(config.get('transform'));
const source = createSourceStream(config.get('source'));
const target = createTargetStream(config.get('target'));

source
    // .pipe(process.stdout)
    .pipe(transformer)
    .pipe(target);
    // .pipe(process.stdout);










