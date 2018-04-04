'use strict';

const debug = require('debug')('transport:tcp-source');
const _ = require('lodash');
const { PassThrough } = require('stream');
const { createServer } = require('net');

/**
 * Входной поток в виде TCP сервера
 * @class
 */
class TcpSource extends PassThrough{

    /**
     * @constructor
     * @param {Object} config Объект с настройками транспорта
     * @param {Number} config.port Порт
     * @param {String} [config.host=127.0.0.1] Хост
     */
    constructor(config) {
        super();
        const { port, host } = _.defaults(config, {
            host: '127.0.0.1'
        });
        this._server = createServer(socket => {
            debug('new connection');
            socket.pipe(this);
        });
        this._server.listen(port, host, () => debug('tcp server ready on  %s:%s', host, port));
    }

}

module.exports = TcpSource;
