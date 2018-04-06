'use strict';

const test = require('ava');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { createSourceStream, createTargetStream } = require('_/transport');

const sourceConfig = {
    type: 'file',
    path: resolve(__dirname, './source-data.txt')
};
const targetConfig = {
    type: 'file',
    path: resolve(__dirname, './.test-output')
};

const source = createSourceStream(sourceConfig);
const target = createTargetStream(targetConfig);

test.cb('copy data from one file to another', t => {
    target.on('unpipe', () => {
        const original = readFileSync(sourceConfig.path);
        const copy = readFileSync(targetConfig.path);
        t.is(original.length, copy.length, 'Copy size is not equal original');
        t.end();
    });

    source.pipe(target);
});


