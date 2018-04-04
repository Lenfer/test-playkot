'use strict';

/**
 * Базовый класс для всех классов наследников
 * @class
 */
class Abstract {

    /**
     * @constructor
     * @param {Object} config Объект с настройками потока
     */
    constructor(config) {

        /**
         * @type {Object}
         */
        this.config = config;

        /**
         * @type {Stream}
         */
        this.stream = null;
    }
}

module.exports = Abstract;
