var pintpack = require('./');
var assert = require('assert');

var closed;

var schema = pintpack.schema(
  { client: new Buffer('abcd1234'),
    schema: 
      [
        { key: 'text', type: 'ascii', length: 5 },
        { key: 'buf', type: 'Buffer', length: 4 },
        { key: 'bool', type: 'boolean' },
        { key: 'nada', type: 'null' },
        { key: 'undef', type: 'undefined' },
        { key: 'uint32', type: 'U32int' },  
        { key: 'uint16', type: 'U16int' },
        { key: 'uint8', type: 'U8int' }                 
      ]
  }
);

var encoded = pintpack.encode(['hello', new Buffer('abcd'), true, null, undefined, 123456789, 65535, 255], schema);
var decoded = pintpack.decode(encoded, schema);

assert.equal(decoded.schema[0].value, 'hello');
assert.deepEqual(decoded.schema[1].value, new Buffer('abcd'));
assert.equal(decoded.schema[2].value, true);
assert.equal(decoded.schema[3].value, null);
assert.equal(decoded.schema[4].value, undefined);
assert.equal(decoded.schema[5].value, 123456789);
assert.equal(decoded.schema[6].value, 65535);
assert.equal(decoded.schema[7].value, 255);

closed = true;

assert(closed);
