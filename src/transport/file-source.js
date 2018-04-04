'use strict';

const { ReadStream } = require('fs');

/**
 * Входной поток в виде файла
 * @class
 */
class FileSource extends ReadStream {

    /**
     * @constructor
     * @param {Object} config Объект с настройками потока
     * @param {String} config.path Путь к файлу
     */
    constructor(config) {
        const { path } = config;
        super(path, {
            flags: 'r',
            encoding: 'utf8',
        });
    }
}

module.exports = FileSource;
