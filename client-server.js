'use strict';


const { Socket, createServer } = require('net');


// Принимающая сторона для отформатированных логов
const server = createServer(function(socket) {
    socket.pipe(process.stdout);
});

server.listen(1378, '127.0.0.1');


// Клиенты с реконектом пока не поднимится сервер обработчик
const client = new Socket();
(function initClient() {
    console.log('Connect client ...');
    client.connect(1377, '127.0.0.1', () => {
        setInterval(() => {
            client.write('{"type": "client", "error": "An application event log entry..", "timestamp": 1518176440, "user_id": 1, "environment": "prod"}\n');
            client.write('{"type": "client", "message": "An application event log entry..", "timestamp": 1518176440, "user_id": 1, "environment": "prod", "ip": "127.0.0.1", "app": "client_app"}\n');
        }, 1000);
    });
    client.on('error', (error) => {
        console.log(error);
        setTimeout(initClient, 5000);
    });
})();

const serverClient = new Socket();
(function initServerClient() {
    console.log('Connect server client ...');
    serverClient.connect(1377, '127.0.0.1', () => {
        setInterval(() => sendData(serverClient), 2000)
    });
    serverClient.on('error', (error) => {
        console.log(error);
        setTimeout(initServerClient, 5000)
    });
})();


function sendData(socket) {
    socket.write('<11>1 2003-10-11T22:14:15.003Z 127.0.0.1 app 10000 - - ERROR\n');
    socket.write('<12>1 2003-10-11T22:14:15.003Z - app 10000 - [info@app env="prod" type="server" some="data"][data@app some="data"] WARNING\n');
    socket.write('BadRequestError: request aborted\n');
    socket.write('    at emitNone (events.js:105:13)\n');
    socket.write('    at IncomingMessage.emit (events.js:207:7)\n');
    socket.write('    at abortIncoming (_http_server.js:410:9)\n');
    socket.write('    at socketOnClose (_http_server.js:404:3)\n');
    socket.write('    at emitOne (events.js:120:20)\n');
    socket.write('    at Socket.emit (events.js:210:7)\n');
    socket.write('    at TCP._handle.close [as _onclose] (net.js:547:12)\n');
    socket.write('<13>1 2003-10-11T22:14:15.003Z 127.0.0.1 app - - [info@app env="prod" type="server"] INFO\n');
    socket.write('<14>1 2003-10-11T22:14:15.003Z 127.0.0.1 app 10000 - [info@app env="prod" type="server"] DEBUG\n');
    socket.write('{"type": "client", "message": "An application event log entry..", "timestamp": 1518176440, "user_id": 1, "environment": "prod", "ip": "127.0.0.1", "app": "client_app"}\n');
}