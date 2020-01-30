const net = require('net');
const fs = require('fs');
const shuffle = require('shuffle-array');
const port = 8124;
const bad = 'DEC';
const good = 'ACK';
const reqClient = 'QA';
let qa = [];
let idx = -1;



const client = new net.Socket();
client.setEncoding('utf8');

client.connect({port: port, host: '127.0.0.1'}, (err) => {
    if (err) {
        console.error('Is not connected')
    }
    fs.readFile('qa.json', (err, text) => {
        if (err) {
            console.error('Error read file')
        } else {
            console.log('Connected');
            qa = JSON.parse(text);
            shuffle(qa);
            client.write(reqClient);
        }
    })
});

client.on('data', (data) => {
    if (data === bad) {
        client.destroy();
    }
    if (data === good) {
        sendQa();
    }
    if (data !== bad && data !== good) {
        let qst = qa[idx];
        let answer = qst.good;
        console.log(`\nQuestion: ${qst.question}`);
        console.log(`---Right answer: ${answer}`);
        console.log(`---Server's answer: ${data}`);
        console.log('---Result: ' + (data === answer ? 'Right answer!': 'Wrong answer!'));
        sendQa();
    }

});

client.on('close', function() {
    console.log('Connection closed');
});

function sendQa() {
    if (idx < qa.length - 1) {
        let qst = qa[++idx].question;
        client.write(qst);
    }
    else
        client.destroy();
}