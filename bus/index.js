var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);

io.on('connection', socket => {
    console.log("connected.");

    socket.on('chat message', msg => socket.broadcast.emit('chat message', msg));

    socket.on('trackables', msg => {
        console.log('message: trackables', msg);
        socket.broadcast.emit('trackables', msg);
    })
});

http.listen(3000, () => console.log("bus started on port 3000"));
