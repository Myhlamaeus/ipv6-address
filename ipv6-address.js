function toString(arr) {
    return Array.prototype.map.call(arr, function(ele) {
        return ele.toString(16);
    }).join(":");
}

class Ipv6Address extends Uint16Array {
    constructor(iterable) {
        let arr = new Uint16Array(this.length);

        for(let i = 0; i < this.length; ++i) {
            Object.defineProperty(this, i, {
                get: function() {
                    return arr[i];
                },
                set: function(val) {
                    arr[i] = val;
                },
                enumerable: true,
                configurable: true
            });
        }

        if(iterable) {
            let i = 0;

            for(let val of iterable) {
                if(i >= this.length) {
                    throw new RangeError("Ipv6Address: iterable is too long");
                }
                this[i++] = val >>> 0;
            }
        }
    }

    toString() {
        return toString(this);
    }

    toShortString() {
        let longestLength = 0,
            length = 0,
            i = 0,
            longestStart,
            start;

        for(let ele of this) {
            if(ele === 0) {
                if(!length) {
                    start = i;
                }
                ++length;
            } else {
                if(length > longestLength) {
                    longestStart = start;
                    longestLength = length;
                }

                length = 0;
            }

            ++i;
        }

        if(typeof(longestStart) === "undefined") {
            return this.toString();
        }
        return toString(this.slice(0, longestStart)) + "::" + toString(this.slice(longestStart + longestLength));
    }

    get length() {
        return 8;
    }

    * keys() {
        for(let i = 0; i < this.length; ++i) {
            yield i;
        }
    }

    * values() {
        for(let key of this.keys()) {
            yield this[key];
        }
    }

    * entires() {
        for(let key of this.keys()) {
            yield [key, this[key]];
        }
    }

    * [Symbol.iterator]() {
        return this.values();
    }
}

function parseParts(parts) {
    return parts.map(function(part) {
        if(!/^[a-f0-9]{1,4}$/.test(part)) {
            throw new Error(`Ipv6Address.parse: invalid part: '${part}'`);
        }
        return parseInt(part, 16);
    });
}

function collapse(...arrs) {
    return [].concat(...arrs);
}

Ipv6Address.parse = function(str) {
    let parts = String(str).split("::");

    if(parts.length > 2) {
        throw new Error("Ipv6Address.parse: expected '::' to occur at most once");
    }
    if(parts.length === 2) {
        parts = parts.map(function(part) {
            return parseParts(part.split(":"));
        });

        if(parts[0].length + parts[1].length > 8) {
            throw new Error("Ipv6Address.parse: expects ':' to occur at most 9 times if '::' occurs");
        }

        parts.splice(1, 1, new Array(8 - parts[0].length - parts[1].length).fill(0));
        return new this(collapse(parts));
    }
    parts = parts[0].split(":");

    if(parts.length !== 8) {
        throw new Error("Ipv6Address.parse: expects ':' to occur exactly 7 times");
    }

    return new this(parseParts(parts));
};

export default Ipv6Address;
