var test = require('tape');
var Transformer = require('./transformer.js');

test('persp example', t => {
    const transformer = new Transformer(
        [158, 64, 494, 69, 495, 404, 158, 404],
        [100, 500, 152, 564, 148, 604, 100, 560]
    );
    
    const result = transformer.transform({ 
        x: 250, y: 120
    });
    
    t.equal(result.x, 117.27521125839255);
    t.end();
});

test('simple trapez', t => {
    const transformer = new Transformer(
        [2, 0, 8, 0, 10, 10, 0, 10],
        [0, 0, 10, 0, 10, 10, 0, 10]
    );
    
    const result = transformer.transform({ 
        x: 5, y: 5
    });
    
    t.equal(result.x, 4.9999999994);
    t.equal(result.y, 6.249999999343751);
    t.end();
});

test('horizontal', t => {
    const transformer = new Transformer(
        [2, 0, 8, 0, 8, 10, 2, 10],
        [0, 0, 10, 0, 10, 10, 0, 10]
    );
    
    const result = transformer.transform({ 
        x: 5, y: 5
    });
    
    t.equal(result.x, 5.0000000002);
    t.equal(result.y, 5);
    t.end();
});

test('stefantest', t => {
    const transformer = new Transformer(
        [100, 0, 0, 0, 100, 100, 0, 100],
        [50, 150, 150, 150, 50, 50, 150, 50]
    );
    
    const result = transformer.transform({ 
        x: 75, y: 50
    });
    
    t.equal(result.x, 75);
    t.equal(result.y, 100);
    t.end();
});