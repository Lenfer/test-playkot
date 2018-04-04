'use strict';

const fs = require('fs');
const Abstract = require('./abstract');


/**
 * Входной поток в виде файла
 * @class
 */
class FileSource extends Abstract {

    /**
     * @constructor
     * @param {Object} config Объект с настройками потока
     * @param {String} config.path Путь к файлу
     */
    constructor(config) {
        const { path } = config;
        super(config);
        this.stream = fs.createReadStream(path, {
            flags: 'r',
            encoding: 'utf8',
        });
    }
}

module.exports = FileSource;
