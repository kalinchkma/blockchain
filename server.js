const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

/**
 * Blockchain
 */
const BlockChain = require('./libs/BlockChain');
const time = require('./libs/time');
const Block = require('./libs/block/Block');

const coin = new BlockChain();
coin.addNewBlock(new Block(time, {sender: "hunter", reciver: 'nanashi'}));

const app = express();

app.use(express.static(path.join(__dirname, 'clients')));

const server = createServer(app);

const io = new Server(server, {/**option */});


io.on("connection", (socket) => {
    // TODO: handle connection
    socket.emit('join', {
        coin: coin.blockchain
    });
    socket.on('peer-msg', (data) => {
        console.log(`peer msg %s`, data);
    })
});



server.listen(3000);
