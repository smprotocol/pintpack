"use strict";
//
// PintPack, Super fast key value serialization.
//
// Version: 0.0.1
// Author: Mark W. B. Ashcroft (mark [at] fluidecho [dot] com)
// License: MIT or Apache 2.0.
//
// Copyright (c) 2015 Mark W. B. Ashcroft.
// Copyright (c) 2015 FluidEcho.
//


//var preview = require('preview')('pintpack');


var PintPack = function () {

  this.schemas = {};

  // TODO: 
  //'utf8': { length: -1 },
  //'Date': { length: 8 },
  //'double': { length: 8 },
  //'float': { length: 4 },
  //'8int': { length: 1 },
  //'16int': { length: 2 },
  //'32int': { length: 4 },

  this.types = {
    'ascii': true,
    'boolean': true,
    'null': true,
    'undefined': true,
    'Buffer': true,
    'U8int': true,
    'U16int': true,
    'U32int': true
  };

    // dec: 92 \ and 39 ' are not permitted as values.
  this.ascii2dec = { 
    ' ' :  32,  '!' :  33,  '"' :  34,  '#' :  35,  '$' :  36,  '%' :  37,  '&' :  38,  '(' :  40, 
    ')' :  41,  '*' :  42,  '+' :  43,  ',' :  44,  '-' :  45,  '.' :  46,  '/' :  47,  '0' :  48, 
    '1' :  49,  '2' :  50,  '3' :  51,  '4' :  52,  '5' :  53,  '6' :  54,  '7' :  55,  '8' :  56, 
    '9' :  57,  ':' :  58,  ';' :  59,  '<' :  60,  '=' :  61,  '>' :  62,  '?' :  63,  '@' :  64, 
    'A' :  65,  'B' :  66,  'C' :  67,  'D' :  68,  'E' :  69,  'F' :  70,  'G' :  71,  'H' :  72, 
    'I' :  73,  'J' :  74,  'K' :  75,  'L' :  76,  'M' :  77,  'N' :  78,  'O' :  79,  'P' :  80, 
    'Q' :  81,  'R' :  82,  'S' :  83,  'T' :  84,  'U' :  85,  'V' :  86,  'W' :  87,  'X' :  88, 
    'Y' :  89,  'Z' :  90,  '[' :  91,  ']' :  93,  '^' :  94,  '_' :  95,  '`' :  96,  'a' :  97,  
    'b' :  98,  'c' :  99,  'd' :  100, 'e' :  101, 'f' :  102, 'g' :  103, 'h' :  104, 'i' :  105, 
    'j' :  106, 'k' :  107, 'l' :  108, 'm' :  109, 'n' :  110, 'o' :  111, 'p' :  112, 'q' :  113, 
    'r' :  114, 's' :  115, 't' :  116, 'u' :  117, 'v' :  118, 'w' :  119, 'x' :  120, 'y' :  121, 
    'z' :  122, '{' :  123, '|' :  124, '}' :  125, '~' :  126  
  }; 

  // dec: 92 \ and 39 ' are not permitted as values.
  this.dec2ascii = {  
    32  : ' ',  33  : '!',  34  : '"',  35  : '#',  36  : '$',  37  : '%',  38  : '&',  40  : '(',  
    41  : ')',  42  : '*',  43  : '+',  44  : ',',  45  : '-',  46  : '.',  47  : '/',  48  : '0',  
    49  : '1',  50  : '2',  51  : '3',  52  : '4',  53  : '5',  54  : '6',  55  : '7',  56  : '8',  
    57  : '9',  58  : ':',  59  : ';',  60  : '<',  61  : '=',  62  : '>',  63  : '?',  64  : '@',  
    65  : 'A',  66  : 'B',  67  : 'C',  68  : 'D',  69  : 'E',  70  : 'F',  71  : 'G',  72  : 'H',  
    73  : 'I',  74  : 'J',  75  : 'K',  76  : 'L',  77  : 'M',  78  : 'N',  79  : 'O',  80  : 'P',  
    81  : 'Q',  82  : 'R',  83  : 'S',  84  : 'T',  85  : 'U',  86  : 'V',  87  : 'W',  88  : 'X',  
    89  : 'Y',  90  : 'Z',  91  : '[',  93  : ']',  94  : '^',  95  : '_',  96  : '`',  97  : 'a',  
    98  : 'b',  99  : 'c',  100 : 'd',  101 : 'e',  102 : 'f',  103 : 'g',  104 : 'h',  105 : 'i',  
    106 : 'j',  107 : 'k',  108 : 'l',  109 : 'm',  110 : 'n',  111 : 'o',  112 : 'p',  113 : 'q',  
    114 : 'r',  115 : 's',  116 : 't',  117 : 'u',  118 : 'v',  119 : 'w',  120 : 'x',  121 : 'y',  
    122 : 'z',  123 : '{',  124 : '|',  125 : '}',  126 : '~'
  };
  
  this._dec2hex = {  
      0 : '00', 1 : '01', 2: '02', 3 : '03', 4 : '04', 5 : '05', 6 : '06', 7 : '07', 8 : '08',
      9 : '09', 10 : '0a', 11 : '0b', 12 : '0c' , 13 : '0d' , 14 : '0e', 15 : '0f', 16 : '10',
     17 : '11', 18 : '12', 19 : '13', 20 : '14', 21 : '15', 22 : '16', 23 : '17', 24 : '18', 
     25 : '19', 26 : '1a', 27 : '1b', 28 : '1c', 29 : '1d', 30 : '1e', 31 : '1f', 32 : '20',
     33 : '21', 34 : '22', 35 : '23', 36 : '24', 37 : '25', 38 : '26', 39 : '27', 40 : '28',
     41 : '29', 42 : '2a', 43 : '2b', 44 : '2c', 45 : '2d', 46 : '2e', 47 : '2f', 48 : '30',
     49 : '31', 50 : '32', 51 : '33', 52 : '34', 53 : '35', 54 : '36', 55 : '37', 56 : '38',
     57 : '39', 58 : '3a', 59 : '3b', 60 : '3c', 61 : '3d', 62 : '3e', 63 : '3f', 64 : '40',
     65 : '41', 66 : '42', 67 : '43', 68 : '44', 69 : '45', 70 : '46', 71 : '47', 72 : '48',
     73 : '49', 74 : '4a', 75 : '4b', 76 : '4c', 77 : '4d', 78 : '4e', 79 : '4f', 80 : '50',
     81 : '51', 82 : '52', 83 : '53', 84 : '54', 85 : '55', 86 : '56', 87 : '57', 88 : '58',
     89 : '59', 90 : '5a', 91 : '5b', 92 : '5c', 93 : '5d', 94 : '5e', 95 : '5f', 96 : '60',
     97 : '61', 98 : '62', 99 : '63', 100 : '64', 101 : '65', 102 : '66', 103 : '67', 104 : '68', 
    105 : '69', 106 : '6a', 107 : '6b', 108 : '6c', 109 : '6d', 110 : '6e', 111 : '6f', 112 : '70',
    113 : '71', 114 : '72', 115 : '73', 116 : '74', 117 : '75', 118 : '76', 119 : '77', 120 : '78',
    121 : '79', 122 : '7a', 123 : '7b', 124 : '7c', 125 : '7d', 126 : '7e', 127 : '7f', 128 : '80',
    129 : '81', 130 : '82', 131 : '83', 132 : '84', 133 : '85', 134 : '86', 135 : '87', 136 : '88',
    137 : '89', 138 : '8a', 139 : '8b', 140 : '8c', 141 : '8d', 142 : '8e', 143 : '8f', 144 : '90',
    145 : '91', 146 : '92', 147 : '93', 148 : '94', 149 : '95', 150 : '96', 151 : '97', 152 : '98',
    153 : '99', 154 : '9a', 155 : '9b', 156 : '9c', 157 : '9d', 158 : '9e', 159 : '9f', 160 : 'a0',
    161 : 'a1', 162 : 'a2', 163 : 'a3', 164 : 'a4', 165 : 'a5', 166 : 'a6', 167 : 'a7', 168 : 'a8',
    169 : 'a9', 170 : 'aa', 171 : 'ab', 172 : 'ac', 173 : 'ad', 174 : 'ae', 175 : 'af', 176 : 'b0',
    177 : 'b1', 178 : 'b2', 179 : 'b3', 180 : 'b4', 181 : 'b5', 182 : 'b6', 183 : 'b7', 184 : 'b8',
    185 : 'b9', 186 : 'ba', 187 : 'bb', 188 : 'bc', 189 : 'bd', 190 : 'be', 191 : 'bf', 192 : 'c0',
    193 : 'c1', 194 : 'c2', 195 : 'c3', 196 : 'c4', 197 : 'c5', 198 : 'c6', 199 : 'c7', 200 : 'c8',
    201 : 'c9', 202 : 'ca', 203 : 'cb', 204 : 'cc', 205 : 'cd', 206 : 'ce', 207 : 'cf', 208 : 'd0',
    209 : 'd1', 210 : 'd2', 211 : 'd3', 212 : 'd4', 213 : 'd5', 214 : 'd6', 215 : 'd7', 216 : 'd8',
    217 : 'd9', 218 : 'da', 219 : 'db', 220 : 'dc', 221 : 'dd', 222 : 'de', 223 : 'df', 224 : 'e0',
    225 : 'e1', 226 : 'e2', 227 : 'e3', 228 : 'e4', 229 : 'e5', 230 : 'e6', 231 : 'e7', 232 : 'e8',
    233 : 'e9', 234 : 'ea', 235 : 'eb', 236 : 'ec', 237 : 'ed', 238 : 'ee', 239 : 'ef', 240 : 'f0',
    241 : 'f1', 242 : 'f2', 243 : 'f3', 244 : 'f4', 245 : 'f5', 246 : 'f6', 247 : 'f7', 248 : 'f8',
    249 : 'f9', 250 : 'fa', 251 : 'fb', 252 : 'fc', 253 : 'fd', 254 : 'fe', 255 : 'ff' 
  };
  
  this._client_id = new Buffer(8);
  
  this.dec2hex = function (dec) {
    var hex = '';

    if ( Buffer.isBuffer(dec) ) {
      var d = 0;
      for ( d = 0; d < dec.length; d++ ) {
        hex += this._dec2hex[dec[d]];
      }
    } else {
      hex = this._dec2hex[dec];
    }

    return hex;
  };
  
};
module.exports = new PintPack();



PintPack.prototype.schema = function (obj) {

  // register new schema.
  
  // client
  if ( obj.client === undefined ) {
    obj.client = new Buffer([0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00], 'hex');
  }
  var client = this.dec2hex(obj.client);
  
  if ( this.schemas[client] === undefined ) {
    this.schemas[client] = [];
  }
  
  //var id = Object.keys(this.schemas[client]).length;
  var id = this.schemas[client].length;
  if ( obj.id != undefined ) id = obj.id;
  obj.id = id;
  
  var length = 0;   // the length (size) in bytes.
  var x = 0;
  for ( x = 0; x < obj.schema.length; x++ ) {
  
    if ( this.types[obj.schema[x].type] === undefined ) return 'not valid type!';
  
    switch (obj.schema[x].type) {
      
      case 'ascii':
      
        length += obj.schema[x].length;
        break;
    
      case 'U32int':

        length += 4;
        break;

      case 'U16int':

        length += 2;
        break;      
  
      case 'U8int':

        length += 1;
        break;

      case 'Buffer':

        length += obj.schema[x].length;
        break;      

      case 'boolean':

        length += 1;
        break;

      case 'null':

        length += 1;
        break;  

      case 'undefined':

        length += 1;
        break;        

     }
  
  }
  
  obj.length = length;  
  
  this.schemas[client][id] = obj;
  
  return obj;

};



PintPack.prototype.encode = function (values, schema) {

  var len = 8 + 2 + schema.length;    // lengths: 8 = client, 2 = id, schema.length.

  var buffer = new Buffer( len );
  var offset = 0;

  // client
  if ( schema.client === undefined ) {
    schema.client = new Buffer([0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00], 'hex');
  }
  
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  buffer[offset] = schema.client[offset++];
  
  // id (schema)
  buffer[offset++] = schema.id >> 8 & 0xff;
  buffer[offset++] = schema.id & 0xff;  

  // for each key - add value.
  var key = 0;
  for ( key = 0; key < schema.schema.length; key++ ) {

    switch (schema.schema[key].type) {

      case 'ascii':
 
        var s = 0;
        for ( s = 0; s < schema.schema[key].length; s++ ) {
          if ( values[key][s] === undefined ) {
            var dec = 0x00;
          } else {
            var dec = this.ascii2dec[values[key][s]];
          }       
          buffer[offset++] = dec;
        }

        break;

      case 'U32int':    // 4 bytes.

        buffer[offset++] = values[key] >> 24 & 0xff;
        buffer[offset++] = values[key] >> 16 & 0xff;
        buffer[offset++] = values[key] >> 8 & 0xff;
        buffer[offset++] = values[key] & 0xff;
  
        break;

     case 'U16int':   // 2 bytes.

        buffer[offset++] = values[key] >> 8 & 0xff;
        buffer[offset++] = values[key] & 0xff;
  
        break;    
  
     case 'U8int':    // 1 bytes.

        buffer[offset++] = values[key];   //values[key] & 0xff;
  
        break; 

      case 'Buffer':

        values[key].copy(buffer, offset, 0, schema.schema[key].length);
        offset += schema.schema[key].length;
        
        break;   
         
      case 'boolean':
      
        if ( values[key] ) {
          buffer[offset++] = 1 & 0xff;    // 1 = true
        } else {
          buffer[offset++] = 0 & 0xff;    // 0 = false
        }

        break;

      case 'null':
      
        buffer[offset++] = 0x00;    // null
        
        break;

      case 'undefined':
      
        buffer[offset++] = 0x00;    // undefined
        
        break;

    }
  
  }

  return buffer;

};



PintPack.prototype.decode = function (buffer, _schema) {

  var offset = 0;

  var client_hex = '';
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];
  client_hex += this._dec2hex[buffer[offset++]];            

  var id = (buffer[offset++] << 8) + (buffer[offset++]);    // equivalent to readUInt16BE.
  
  var schema = undefined;
  if ( _schema != undefined ) {
    schema = _schema;
  } else {
    schema = this.schemas[client_hex][id];
  }
  
  // for each key - add value.
  var key = 0;
  for ( key = 0; key < schema.schema.length; key++ ) {
  
    switch (schema.schema[key].type) {
      
      case 'ascii':
      
        var buf = new Buffer(schema.schema[key].length);
        buffer.copy(buf, 0, offset, offset += schema.schema[key].length);
        
        var value = '';   // string
        
        var s = 0;
        for ( s = 0; s < buf.length; s++ ) {
          if ( buf[s] === 0x00 ) continue;    // if NULL, skip.
          value += this.dec2ascii[buf[s]];
        }

        schema.schema[key].value = value;
      
        break;
    
      case 'U32int':

        var value = (buffer[offset++] << 24) + (buffer[offset++] << 16) + (buffer[offset++] << 8) + (buffer[offset++]);   // equivalent to readUInt32BE.  
        schema.schema[key].value = value;
        
        break;
          
      case 'U16int':

        var value = (buffer[offset++] << 8) + (buffer[offset++]);   // equivalent to readUInt16BE.
        schema.schema[key].value = value;
        
        break;

      case 'U8int':

        var value = buffer[offset++];
        schema.schema[key].value = value;
        
        break;
 
      case 'Buffer':

        var buf = new Buffer(schema.schema[key].length);
        buffer.copy(buf, 0, offset, offset += schema.schema[key].length);
        schema.schema[key].value = buf;
      
        break;
        
      case 'boolean':
      
        if ( buffer[offset++] === 1 ) {
          schema.schema[key].value = true;
        } else {
          schema.schema[key].value = false;
        }
        
        break;

      case 'null':
        
        schema.schema[key].value = null;
        offset++;
        
        break;

      case 'undefined':
        
        schema.schema[key].value = undefined;
        offset++;
        
        break;
        
    }

  } 

  return schema;

};


