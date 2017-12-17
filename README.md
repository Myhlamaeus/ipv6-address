# ipv6-address [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> A single IPv6 address

## Installation

```sh
$ npm install --save ipv6-address
```

## Usage

```js
import toIPv6Address from "ipv6-address";
const toIPv6Address = require("ipv6-address");

toIPv6Address([1, 2, 3, 4, 5, 6, 7, 8]); // [1, 2, 3, 4, 5, 6, 7, 8]
toIPv6Address("::"); // [0, 0, 0, 0, 0, 0, 0, 0]
toIPv6Address("1::2"); // [1, 0, 0, 0, 0, 0, 0, 2]
toIPv6Address("::dead:1234"); // 0, 0, 0, 0, 0, 0, 57005, 4660]
String(toIPv6Address("0:0:0:0:0:0:0:0")); // "::"
toIPv6Address("1:2:3:4:0:5:6:7").toString(); // "1:2:3:4:0:5:6:7", a single zero field must not be omitted
toIPv6Address("::dead:1234").toString(true); // "0000:0000:0000:0000:0000:0000:dead:1234"
toIPv6Address("0:0"); // Throws an error (not long enough)
toIPv6Address("0:0:0:0:0:0:0:0:0"); // Throws an error (too long)
Number(toIPv6Address("0:0:0:0:0:0:0:0:0")); // Throws an error (2^[16 * 8] is too long for JS)
```

```js
import IPv6Address from "ipv6-address/IPv6Address"; // Extends Uint8Array
const IPv6Address = require("ipv6-address/IPv6Address"); // Extends Uint8Array

new IPv6Address([0, 0, 0, 0, 0, 0, 0, 0]); // [0, 0, 0, 0, 0, 0, 0, 0]
IPv6Address.parse("::dead:1234"); // [0, 0, 0, 0, 0, 0, 57005, 4660]
IPv6Address.from([0, 0, 0, 0, 0, 0, 57005, 4660]); // [0, 0, 0, 0, 0, 0, 57005, 4660]
IPv6Address.of(0, 0, 0, 0, 0, 0, 57005, 4660); // [0, 0, 0, 0, 0, 0, 57005, 4660]
new IPv6Address([0, 0, 0]); // Throws an error (not long enough)
new IPv6Address([0, 0, 0, 0, 0, 0, 0, 0, 0]); // Throws an error (too long)
```

## License

MIT © [Malte-Maurice Dreyer](https://github.com/Myhlamaeus)

[npm-image]: https://badge.fury.io/js/ipv6-address.svg
[npm-url]: https://npmjs.org/package/ipv6-address
[travis-image]: https://travis-ci.org/Myhlamaeus/ipv6-address.svg?branch=master
[travis-url]: https://travis-ci.org/Myhlamaeus/ipv6-address
[daviddm-image]: https://david-dm.org/Myhlamaeus/ipv6-address.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Myhlamaeus/ipv6-address
[coveralls-image]: https://coveralls.io/repos/Myhlamaeus/ipv6-address/badge.svg
[coveralls-url]: https://coveralls.io/r/Myhlamaeus/ipv6-address
