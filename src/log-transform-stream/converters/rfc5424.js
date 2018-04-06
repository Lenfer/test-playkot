'use strict';

const _ = require('lodash');
const parse = require('nsyslog-parser');
const transform = require('js-object-transform');
const debug = require('debug')('transform-stream:converters:rfc5424');

const MATCH_KEY_NAME = /^([\d\w]+)@/;

const SYS_FIELDS = [
    'originalMessage', 'pri', 'prival', 'facilityval', 'levelval', 'facility', 'level', 'type', 'ts', 'host',
    'appName', 'message', 'chain', 'structuredData', 'fields', 'header'
];

// Правила трансформации данных
const rules = {
    logsource: () => 'server',
    program: 'appName',
    host: 'host',
    env: source => {
        const dataWithEnv = _.find(source.structuredData, data => data.env);
        return dataWithEnv ? dataWithEnv.env : '';
    },
    type: source => {
        const severity = source.levelval;
        switch (true) {
            case _.inRange(severity, 0, 4):
                return 'ERROR';
            case severity === 4:
                return 'WARNING';
            case _.inRange(severity, 5, 7):
                return 'INFO';
            case severity === 7:
                return 'DEBUG'
        }
    },
    timestamp: source => new Date(source.ts).toISOString(),
    message: 'message',
    // Трансформируем и сложим все структуированные данные из лога, а также исключим env
    _data: source => {
        // Добавим дополнотильные данные
        const output = _.omit(source, SYS_FIELDS);

        // Подмешаем структуированные данные
        return _.reduce(source.structuredData, (acc, obj) => {
            const key = obj.$id.split('@')[0];
            return _.set(acc, key, _.omit(obj, ['$id', 'env']))
        }, output);
    }

};

/**
 * Преобразование строки в формат выходных данных
 * @param {String} line Запись лога
 * @returns {Object} -
 */
module.exports = line => {
    debug('Start convert data');
    const parsed = parse(line);
    debug('Input: %j', parsed);
    const output = transform(parsed, rules);
    debug('Output: %j', output);
    return output;
};
