'use strict';

const assert = require('assert');
const { readFileSync } = require('fs');

const config = require('config');
const sourceFile = config.get('source');
const targetFile = config.get('target');

const { createSourceStream, createTargetStream } = require('_/transport');
const source = createSourceStream(sourceFile);
const target = createTargetStream(targetFile);

target.stream.on('unpipe', () => {
    const original = readFileSync(sourceFile.path);
    const copy = readFileSync(targetFile.path);

    assert.equal(original.length, copy.length, 'Copy size is not equal original');
    console.log('Test passed');
});

source.stream.pipe(target.stream);
