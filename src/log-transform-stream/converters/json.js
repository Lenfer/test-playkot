'use strict';

const _ = require('lodash');
const transform = require('js-object-transform');
const debug = require('debug')('transform-stream:converters:json');

// Правила трансформации данных
const rules = {
    logsource: () => 'client',
    program: 'app',
    host: 'ip',
    env: 'environment',
    type: source => _.has(source, 'error') ? 'ERROR' : 'INFO',
    timestamp: source => source.timestamp ? new Date(source.timestamp * 1000).toISOString() : '',
    message: source => source.error || source.message || '',
    // Сложим в data все поля кроме задействованных выше
    _data: source => _.omit(source, ['type', 'app', 'ip', 'environment', 'error', 'message', 'timestamp'])
};

/**
 * Преобразование строки в формат выходных данных
 * @param {String} line Запись лога
 * @returns {Object} -
 */
module.exports = line => {
    debug('Start convert data');
    const parsed = JSON.parse(line);
    debug('Input: %j', parsed);
    const output = transform(parsed, rules);
    debug('Output: %j', output);
    return output;
};
