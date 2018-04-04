const fs = require('fs');
const Abstract = require('./abstract');


/**
 * Выходной поток в виде файла
 * @class
 */
class FileTarget extends Abstract {

    /**
     * @constructor
     * @param {Object} config Объект с настройками потока
     * @param {String} config.path Путь к файлу
     */
    constructor(config) {
        const { path } = config;
        super(config);
        this.stream = fs.createWriteStream(path, {
            flags: 'w',
            encoding: 'utf8',
        });
    }
}

module.exports = FileTarget;
