"use strict";
//
// PintPack, Example.
//
// Version: 0.0.1
// Author: Mark W. B. Ashcroft (mark [at] fluidecho [dot] com)
// License: MIT or Apache 2.0.
//
// Copyright (c) 2015 Mark W. B. Ashcroft.
// Copyright (c) 2015 FluidEcho.
//



var pintpack = require('..');


var schema = pintpack.schema(
  { client: new Buffer('abcd1234'),
    schema: 
      [
        { key: 'text', type: 'ascii', length: 5 },  // can set length greater than value.
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


var encoded = pintpack.encode(['hello', new Buffer('abcd'), true, null, undefined, 123456789, 65535, 255], schema);   // values in array, schema obj to use.
console.log('encoded', encoded);

var decoded = pintpack.decode(encoded, schema);
console.log('decoded', decoded);

