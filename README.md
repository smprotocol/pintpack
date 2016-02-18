# PintPack [![Build Status](https://api.travis-ci.org/smprotocol/pintpack.png)](https://travis-ci.org/smprotocol/pintpack)

__Super fast key value serialization.__

PintPack is a very fast and lightweight key/value serializer from object to Buffer and back again.

PintPack is more than 2x faster than JSON.parse and more than 4x faster than JSON.stringify. 
Designed to replace JSON, BSON or MessagePack etc where speed matters more than having deep nested 
objects. _PintPack only supports single level unnested keys and values, EG: {foo:'bar', num:555}._


## Installation

```
npm install pintpack
```


## Examples

```js
var pintpack = require('pintpack');

// first define a schema to use.
var schema = pintpack.schema(
  {
    schema: 
      [
        { key: 'foo', type: 'ascii', length: 3 },   // length can be greater than value.
        { key: 'num', type: 'U32int' } 
      ]
  }
);

// can now encode (to Buffer) values for the schema.
var encoded = pintpack.encode(['bar', 123456789], schema);    // values in array, schema to use.

console.log('encoded', encoded);    // <Buffer  00 00 00 00 00 00 00 00 00 00 62 61 72 07 5b cd 15>


// decode (Buffer to object) values using the schema.
var decoded = pintpack.decode(encoded);

console.log('decoded', decoded);    // schema object with values.

```
All the value types and options:
```js
var pintpack = require('pintpack');

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

var decoded = pintpack.decode(encoded, schema);		// can include schema to use.
console.log('decoded', decoded);

```


## Supported Value Types

  - ascii (set length).
  - Buffer (set length).
  - boolean
  - null
  - undefined
  - U32int (unsigned 32 bit integer).
  - U16int (unsigned 16 bit integer).
  - U8int (unsigned 8 bit integer).


## PintPack Protocol

The protocol consists of having a separate schema defining the keys and a separate binary object 
holding the values. The values object is encoded and decoded using the same schema - a id is 
assigned to both the schema and values. 

_The PintPack Protocol is designed for implementation in any programing language._

### Schema

The schema is an array of key/values, each item sets the key name, type and length (if not set by 
the type). The array item order matches the values object, its order is strict. The schema can also 
be set with a client identifier (as a 8 byte Buffer) and will be assigned a id number per client 
(upto 65,535) - this will be used when decoding to match the assigned schema.

### Values

The _values_ is a array of the keys' values in binary. The first 8 bytes are to assign the client 
identifier, the next 2 bytes are used to assign the client id number - followed by the values in the 
order corresponding with the schema array of values, the order is strict.

### Example

If the schema was:

```
var schema = pintpack.schema(
  {
    client: new Buffer('abcdefgh'),
    schema: 
      [
        { key: 'foo', type: 'ascii', length: 3 },   // length can be greater than value.
        { key: 'num', type: 'U32int' } 
      ]
  }
);

The values would be (shown is spaced hexadecimal):
+------------------------+-----+--------+------------+
| 61 62 63 64 65 66 67 68 00 00 62 61 72 07 5b cd 15 |
+------------------------+-----+--------+------------+
| CLIENT                 | ID  | f o o  | 123456789  |                                        |
+------------------------------+---------------------+
|                              | VALUES              |
+------------------------------+--------+------------+


Values octet structure:
+----------------------------------------------------------------+
| VALUE OBJECT (binary)                                          |
+--------+-----------------+------+-----------------+------------+
|        | CLIENT          | ID   | VALUE[0]        | NEXT VALUE |
+--------+-----------------+------+-----------------+------------+
| OCTETS | 0,1,2,3,4,5,6,7 | 8,9  | <KEY[0].LENGTH> | ...        |
+--------+-----------------+------+------------+-----------------+
```

## License

Choose either: [MIT](http://opensource.org/licenses/MIT) or [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
