var ev3dev = require('ev3dev-lang');
var socket = require('socket.io-client')('http://10.0.0.196:3000');

// npm install ev3dev-lang socket.io-client
// node index.js


function Dispatcher() {
  this.listeners = {};
}
Dispatcher.prototype.register = function register(action, listener) {
    if (!this.listeners[action]) {
        this.listeners[action] = [];
    }
    this.listeners[action].push(listener);
};
Dispatcher.prototype.emit = function emit(action, payload) {
        console.log('Dispatcher: executing ' + action);
        if (!this.listeners[action]) {
            console.error('no listener attachted for action' + action);
            return;
        }
        this.listeners[action].forEach(function(listener) {
            listener(payload);
        });
};

var dispatcher = new Dispatcher();
var motorA = new ev3dev.Motor(ev3dev.OUTPUT_A);
var motorB = new ev3dev.Motor(ev3dev.OUTPUT_B);

var runMotorA = function() {
    motorA.speedSp = 500;
    motorA.dutyCycleSp = 50;
    motorA.command = 'run-forever';
}
var runMotorB = function() {
    motorB.speedSp = 500;
    motorB.dutyCycleSp = 50;
    motorB.command = 'run-forever';
}


dispatcher.register('straight', function(pl) { 
    runMotorA();
    runMotorB();
});
dispatcher.register('stop', function(pl) {
    motorA.stop();
    motorB.stop();
});
dispatcher.register('left', function(pl) {
    motorA.stop();
    runMotorB();  
});
dispatcher.register('right', function(pl) {
    runMotorA();
    motorB.stop(); 
});

socket.on('command', function(c) {
    if (c.target === "lego-ev3") {
        dispatcher.emit(c.command, {});
    }
});