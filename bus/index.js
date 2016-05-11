var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);

const listenPort = 3000;

io.on('connection', socket => {
    console.log("connected.");

    socket.on('command', msg => socket.broadcast.emit('command', msg));
    
    socket.on('configChange', msg => socket.broadcast.emit('configChange', msg));

    socket.on('trackables', msg => {
        console.log('# of points: ', msg.length);
        console.log(msg);
        socket.broadcast.emit('trackables', msg);
    })
});

http.listen(listenPort, () => console.log("bus started on port " + listenPort));
