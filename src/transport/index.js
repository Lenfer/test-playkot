'use strict';

/**
 * Создать поток с входящими данными
 * @param {Object} config Объект с настройками потока
 * @param {String} config.type Тип потока
 * @returns {Object}
 */
function createSourceStream(config) {
    const { type } = config;
    try {
        const Source = require(`./${ type }-source`);
        return new Source(config);
    } catch(e) {
        throw new Error(`Source transport with type "${ type }" not found. Error: ${e.stack}`);
    }
}

/**
 * Создать поток для исходящих данных
 * @param {Object} config Объект с настройками потока
 * @param {String} config.type Тип потока
 * @returns {Object}
 */
function createTargetStream(config) {
    const { type } = config;
    try {
        const Target = require(`./${ type }-target`);
        return new Target(config);
    } catch(e) {
        throw new Error(`Target transport with type "${ type }" not found. Error: ${e.stack}`);
    }
}


module.exports = {
    createSourceStream,
    createTargetStream
};
