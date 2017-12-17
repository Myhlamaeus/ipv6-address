const assert = require('assert');
const IPv6Address = require('../IPv6Address');

/* global describe, it, beforeEach */

describe('IPv6Address()', function() {
  let addr;

  beforeEach(function() {
    addr = new IPv6Address();
  });

  describe('parts', function() {
    it('should be initialised with 0 for each part', function() {
      assert.equal(addr[0], 0);
      assert.equal(addr[1], 0);
      assert.equal(addr[2], 0);
      assert.equal(addr[3], 0);
      assert.equal(addr[4], 0);
      assert.equal(addr[5], 0);
      assert.equal(addr[6], 0);
      assert.equal(addr[7], 0);
      assert.equal(addr.length, 8);
    });

    it('should allow to modify parts', function() {
      let arr = new Array(8).fill(0);

      for (let i = 0; i < 8; ++i) {
        arr[i] = i + 1;
        addr[i] = arr[i];
        assert.deepEqual(addr, arr);
      }
      assert.deepEqual(addr, [1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should cut off numbers when to high (like Uint16Array)', function() {
      let arr = new Array(8).fill(0);

      for (let i = 0; i < 8; ++i) {
        arr[i] = i + 1;
        addr[i] = arr[i] + 65535 + 1;
        assert.deepEqual(addr, arr);
      }
      assert.deepEqual(addr, [1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('.parse(str)', function() {
    it('should work when omitting zeroes', () => {
      const test = {
        '::': [0, 0, 0, 0, 0, 0, 0, 0],
        '1::': [1, 0, 0, 0, 0, 0, 0, 0],
        '::1': [0, 0, 0, 0, 0, 0, 0, 1],
        '1::2': [1, 0, 0, 0, 0, 0, 0, 2],
        '1:2::3': [1, 2, 0, 0, 0, 0, 0, 3],
        '1::2:3': [1, 0, 0, 0, 0, 0, 2, 3],
        '1:2::3:4': [1, 2, 0, 0, 0, 0, 3, 4]
      };

      for (const str of Object.keys(test)) {
        assert.deepEqual(IPv6Address.parse(str), new IPv6Address(test[str]));
      }
    });
  });

  describe('#toString()', function() {
    it('should be 0000:0000:0000:0000:0000:0000:0000:0000 when not shortened and not modified', function() {
      assert.equal(
        addr.toString({ shorten: false }),
        '0000:0000:0000:0000:0000:0000:0000:0000'
      );
    });

    it('should be :: when shortened and not modified', function() {
      assert.equal(addr.toString(), '::');
    });

    it('should not omit a single zero field', function() {
      for (let i = 0; i < 8; ++i) {
        addr[i] = i;
      }

      assert.equal(addr.toString(), '0:1:2:3:4:5:6:7');

      addr[0] = 1;
      addr[1] = 0;
      assert.equal(addr.toString(), '1:0:2:3:4:5:6:7');

      addr[1] = 1;
      addr[6] = 0;
      assert.equal(addr.toString(), '1:1:2:3:4:5:0:7');

      addr[6] = 6;
      addr[7] = 0;
      assert.equal(addr.toString(), '1:1:2:3:4:5:6:0');
    });

    it('should work when parts are modified', function() {
      let arr = new Array(8).fill(0);

      for (let i = 0; i < 8; ++i) {
        arr[i] = i + 1;
        addr[i] = arr[i];

        let expected = arr.join(':');
        if (i < 6) {
          expected = arr.slice(0, i + 1).join(':') + '::';
        }

        assert.equal(addr.toString(), expected);
      }
      assert.equal(addr.toString(), '1:2:3:4:5:6:7:8');
    });
  });

  describe('#keys()', function() {
    it('should work', function() {
      for (let i = 0; i < 8; ++i) {
        addr[i] = i + 10;
      }

      let i = 0;
      for (let key of addr.keys()) {
        assert.equal(key, i);
        ++i;
      }
      assert.equal(i, 8);
    });
  });

  describe('#values()', function() {
    it('should work', function() {
      for (let i = 0; i < 8; ++i) {
        addr[i] = i + 10;
      }

      let i = 0;
      for (let val of addr.values()) {
        assert.equal(val, i + 10);
        ++i;
      }
      assert.equal(i, 8);
    });
  });

  describe('#[Symbol.iterator]()', function() {
    it('should work', function() {
      for (let i = 0; i < 8; ++i) {
        addr[i] = i + 10;
      }

      let i = 0;
      for (let val of addr) {
        assert.equal(val, i + 10);
        ++i;
      }
      assert.equal(i, 8);
    });
  });

  describe('#entries()', function() {
    it('should work', function() {
      for (let i = 0; i < 8; ++i) {
        addr[i] = i + 10;
      }

      let i = 0;
      for (let entry of addr.entries()) {
        assert.deepEqual(entry, [i, i + 10]);
        ++i;
      }
      assert.equal(i, 8);
    });
  });
});
