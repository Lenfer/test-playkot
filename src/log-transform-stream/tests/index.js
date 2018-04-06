'use strict';

const test = require('ava');
const fs = require('fs');
const { resolve } = require('path');
const jsonConverter = require('../converters/json');
const rfcConverter = require('../converters/rfc5424');
const LogTransformStream = require('../');


test('json transform', t => {
    const jsonOutput = jsonConverter('{"type": "client", "message": "Message", "timestamp": 1518176440, ' +
        '"environment": "prod", "ip": "127.0.0.1", "app": "client_app", "user_id": 1}');

    t.deepEqual(jsonOutput, {
        "logsource": "client",
        "program": "client_app",
        "host": "127.0.0.1",
        "env": "prod",
        "type": "INFO",
        "timestamp": "2018-02-09T11:40:40.000Z",
        "message": "Message",
        "_data": {
            "user_id": 1
        }
    });
});


test('RFC5424 transform', (t) => {
    const rfcOutput = rfcConverter('<11>1 2018-02-09T12:00:00.003Z 127.0.0.1 app 10000 - [info@app env="prod" ' +
        'type="server" some="data"][data@app some="data"] Error');

    t.deepEqual(rfcOutput, {
        logsource: 'server',
        program: 'app',
        host: '127.0.0.1',
        env: 'prod',
        type: 'ERROR',
        timestamp: '2018-02-09T12:00:00.003Z',
        message: 'Error',
        _data: {
            version: 1,
            pid: '10000',
            messageid: '-',
            info: {
                type: 'server',
                some: 'data'
            },
            data: {
                some: 'data'
            }
        }
    });
});

test.cb('LogTransformStream default settings', t => {
    const etalon = require('./log-output-etalon');
    const adapter = [];
    const transformer = new LogTransformStream();
    const source = fs.createReadStream(resolve(__dirname, './source-data.txt'), {
        flags: 'r',
        encoding: 'utf8',
    });

    transformer.on('data', e => adapter.push(JSON.parse(e.toString())));
    transformer.on('unpipe', e => {
        etalon.forEach((el, idx) => t.deepEqual(el, adapter[idx]));
        t.end();
    });
    source.pipe(transformer);

});


