var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);

const listenPort = 3000;

io.on('connection', socket => {
    console.log("connected.");

    socket.on('chat', msg => socket.broadcast.emit('chat', msg));

    socket.on('trackables', msg => {
        console.log('message: trackables', msg);
        socket.broadcast.emit('trackables', msg);
    })
});

http.listen(listenPort, () => console.log("bus started on port " + listenPort));
