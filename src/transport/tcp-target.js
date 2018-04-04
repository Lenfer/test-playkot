'use strict';

const debug = require('debug')('transport:tcp-target');
const _ = require('lodash');
const { Socket } = require('net');

/**
 * Исходящий поток в виде TCP клиента
 * @class
 */
class TcpTarget extends Socket{

    /**
     * @constructor
     * @param {Object} config
     * @param {Object} config Объект с настройками транспорта
     * @param {Number} config.port Порт
     * @param {String} [config.host=127.0.0.1] Хост
     * @param {Number} [config.retryTimeout=5000] Задержка между переподключениями
     * @param {Number} [config.retryCount=5] Количество попыток переподключения
     */
    constructor(config) {
        super();
        this._config = _.defaults(config, {
            host: '127.0.0.1',
            retryTimeout: 5000,
            retryCount: 5
        });

        // В случае ошибки переподключимся
        this.on('error', error => {
            console.log(error);
            console.log('Reconnection ...');
            if (this._retryCount--) {
                setTimeout(() => this.connect(), this._config.retryTimeout);
            } else {
                throw error
            }
        });

        this._retryCount = this._config.retryCount;
        this.connect();
    }

    /**
     * Переопределенный метод соединения
     * @override
     */
    connect() {
        const { retryCount, port, host } = this._config;
        return super.connect(port, host, () => {
            this._retryCount = retryCount;
            debug('connected');
        });
    }

}

module.exports = TcpTarget;
