'use strict';

const { WriteStream } = require('fs');

/**
 * Выходной поток в виде файла
 * @class
 */
class FileTarget extends WriteStream {

    /**
     * @constructor
     * @param {Object} config Объект с настройками потока
     * @param {String} config.path Путь к файлу
     */
    constructor(config) {
        const { path } = config;
        super(path, {
            flags: 'w',
            encoding: 'utf8',
        });
    }
}

module.exports = FileTarget;
