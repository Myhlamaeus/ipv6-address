import Ipv6Address from "../ipv6-address";
import assert from "assert";

/* global describe, it, beforeEach */

describe("Ipv6Address()", function() {
    let addr;

    beforeEach(function() {
        addr = new Ipv6Address();
    });

    it("should be initialised with 0 for each part", function() {
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

    it("should be 0:0:0:0:0:0:0:0 when cast to string", function() {
        assert.equal(String(addr), "0:0:0:0:0:0:0:0");
    });

    it("should be :: when cast to short string", function() {
        assert.equal(addr.toShortString(), "::");
    });

    it("should allow to modify parts", function() {
        let arr = new Array(8).fill(0);

        for(let i = 0; i < 8; ++i) {
            addr[i] = arr[i] = i + 1;
            assert.deepEqual(addr, arr);
        }
        assert.deepEqual(addr, [1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should correctly stringify when parts are modified", function() {
        let arr = new Array(8).fill(0);

        for(let i = 0; i < 8; ++i) {
            addr[i] = arr[i] = i + 1;
            assert.equal(String(addr), arr.join(":"));
            if(i === 7) {
                assert.equal(addr.toShortString(), arr.join(":"));
            } else {
                assert.equal(addr.toShortString(), arr.slice(0, i + 1).join(":") + "::");
            }
        }
        assert.equal(String(addr), "1:2:3:4:5:6:7:8");
    });

    it("should cut off numbers when to high (like Uint16Array)", function() {
        let arr = new Array(8).fill(0);

        for(let i = 0; i < 8; ++i) {
            arr[i] = i + 1;
            addr[i] = arr[i] + 65535 + 1;
            assert.deepEqual(addr, arr);
        }
        assert.deepEqual(addr, [1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should be iterable", function() {
        for(let i = 0; i < 8; ++i) {
            addr[i] = i + 10;
        }

        let i = 0;
        for(let key of addr.keys()) {
            assert.equal(key, i);
            ++i;
        }
        assert.equal(i, 8);
        i = 0;
        for(let value of addr.values()) {
            assert.equal(value, i + 10);
            ++i;
        }
        assert.equal(i, 8);
        i = 0;
        for(let value of addr) {
            assert.equal(value, i + 10);
            ++i;
        }
        assert.equal(i, 8);
        i = 0;
        for(let entry of addr.entries()) {
            assert.deepEqual(entry, [i, i + 10]);
            ++i;
        }
        assert.equal(i, 8);
    });
});
