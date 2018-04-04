'use strict';

const debug = require('debug')('log-transform-stream:');
const _ = require('lodash');
const { Transform } = require('stream');

// Регулярные выражения для проверки форматов
const IS_RFC5424 = /^<\d+>/;
const IS_JSON = /^\{.*\:.*\}$/;

const convertJson = require('./converters/json');
const convertRfc5424 = require('./converters/rfc5424');

class LogTransformStream extends Transform {
    constructor(config) {
        super();

        this._filters = _.get(config, 'filters') || {};

        // Кусок строки который пришел не полдностью
        this._uncomplitedLine = '';

        // Последнее преобразованное сообщение в виде объекта
        this._lastLogMessage = null;

        // Переменная для аккумулирования многострочных не форматированных данных
        this._unformattedData = []
    }

    push(data) {
        if (_.isObject(data)) {
            const types = this._filters.types;
            // Фильтрация по типу сообщения
            if (types && !_.includes(types, data.type)) {
                return;
            }
            return super.push(JSON.stringify(data) + '\n');
        }
        return super.push(data);
    }

    _completeUnformattedMessage() {
        if (this._unformattedData.length) {
            debug('complete unformatted multiline message');
            this.push({
                message: this._unformattedData.join(' | '),
                timestamp: _.get(this._lastLogMessage, 'timestamp') || (new Date()).toISOString(),
                type: 'ERROR'
            });
            this._unformattedData = [];
        }
    }


    _transform(chunk, enc, cb) {
        debug('start transform input chunk');
        // Разделим входящий кусок данных на строки
        // тут есть возможность, что при сливание данных из нескольких потоков в один трансформер, произойдет
        // конфликт, что незаконченная строка одного источника замешается в начало куска данных другого источника
        const lines = (this._uncomplitedLine + chunk).split('\n');

        debug('%d lines detected', lines.length);

        // Обнулим незавершенную строку
        this._uncomplitedLine = '';

        // Если есть незаконченная строка лога, запомним ее до следующей части данных
        if (lines.length > 1 && Boolean(_.last(lines))) {
            debug('has uncomplited line');
            this._uncomplitedLine = lines.pop();
        }

        // Переберем все строки и обработаем их в зависимости от формата
        _.each(lines, (line, idx) => {
            // Если строка пустая, то пропустим ее
            if (!line) {
                return;
            }

            debug('Check format for line: %s', line);

            // Определим формат и выполним преобразование
            switch (true) {

                // Обработка для формата RFC5424
                case IS_RFC5424.test(line):
                    debug('RFC5424 line');
                    // Сформируем сообщение лога из многострочного неформатированного кускав (если есть такой)
                    this._completeUnformattedMessage();
                    this._lastLogMessage = convertRfc5424(line);
                    this.push(this._lastLogMessage);
                    break;

                // Обработка дkz JSON формата
                case IS_JSON.test(line):
                    debug('JSON line');
                    // Сформируем сообщение лога из многострочного неформатированного кускав (если есть такой)
                    this._completeUnformattedMessage();
                    this._lastLogMessage = convertJson(line);
                    return this.push(this._lastLogMessage);

                // Поведение по умолчанию
                default:
                    debug('unformatted line');
                    this._unformattedData.push(line.trim());
            }
        });
        cb();
    }
}


module.exports = LogTransformStream;
