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

    it("should allow to modify parts", function() {
        let arr = new Array(8).fill(0);

        for(let i = 0; i < 8; ++i) {
            addr[i] = arr[i] = i + 1;
            assert.deepEqual(addr, arr);
        }
        assert.deepEqual(addr, [1, 2, 3, 4, 5, 6, 7, 8]);
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

    describe("#toString()", function() {
        it("should be 0:0:0:0:0:0:0:0 when not modified", function() {
            assert.equal(addr.toString(), "0:0:0:0:0:0:0:0");
        });

        it("should work when parts are modified", function() {
            let arr = new Array(8).fill(0);

            for(let i = 0; i < 8; ++i) {
                addr[i] = arr[i] = i + 1;
                assert.equal(addr.toString(), arr.join(":"));
            }
            assert.equal(addr.toString(), "1:2:3:4:5:6:7:8");
        });
    });

    describe("#toShortString()", function() {
        it("should be :: when not modified", function() {
            assert.equal(addr.toShortString(), "::");
        });

        it("should work when parts are modified", function() {
            let arr = new Array(8).fill(0);

            for(let i = 0; i < 8; ++i) {
                addr[i] = arr[i] = i + 1;
                if(i === 7) {
                    assert.equal(addr.toShortString(), arr.join(":"));
                } else {
                    assert.equal(addr.toShortString(), arr.slice(0, i + 1).join(":") + "::");
                }
            }
            assert.equal(addr.toShortString(), "1:2:3:4:5:6:7:8");
        });
    });

    describe("#keys()", function() {
        it("should work", function() {
            for(let i = 0; i < 8; ++i) {
                addr[i] = i + 10;
            }

            let i = 0;
            for(let key of addr.keys()) {
                assert.equal(key, i);
                ++i;
            }
            assert.equal(i, 8);
        });
    });

    describe("#values()", function() {
        it("should work", function() {
            for(let i = 0; i < 8; ++i) {
                addr[i] = i + 10;
            }

            let i = 0;
            for(let val of addr.values()) {
                assert.equal(val, i + 10);
                ++i;
            }
            assert.equal(i, 8);
        });
    });

    describe("#[Symbol.iterator]()", function() {
        it("should work", function() {
            for(let i = 0; i < 8; ++i) {
                addr[i] = i + 10;
            }

            let i = 0;
            for(let val of addr) {
                assert.equal(val, i + 10);
                ++i;
            }
            assert.equal(i, 8);
        });
    });

    describe("#entries()", function() {
        it("should work", function() {
            for(let i = 0; i < 8; ++i) {
                addr[i] = i + 10;
            }

            let i = 0;
            for(let entry of addr.entries()) {
                assert.deepEqual(entry, [i, i + 10]);
                ++i;
            }
            assert.equal(i, 8);
        });
    });
});
