import ArrayLikeObjectWrapper from "array-like-object-wrapper";

function toString(arr) {
    return Array.prototype.map.call(arr, function(ele) {
        return ele.toString(16);
    }).join(":");
}

class Ipv6Address extends ArrayLikeObjectWrapper {
    constructor(iterable) {
        let arr = new Uint16Array(8);
        super(arr);

        if(iterable) {
            let i = 0;

            for(let val of iterable) {
                if(i >= arr.length) {
                    throw new RangeError("Ipv6Address: iterable is too long");
                }
                arr[i++] = val >>> 0;
            }
        }
    }

    toString() {
        return toString(this);
    }

    toShortString() {
        let longestLength = 0,
            length = 0,
            longestStart,
            start;

        for(let [key, val] of this.entries()) {
            if(val === 0) {
                if(!length) {
                    start = key;
                }
                ++length;
            }
            if(length > longestLength) {
                longestStart = start;
                longestLength = length;
            }
            if(val !== 0) {
                length = 0;
            }
        }

        if(typeof(longestStart) === "undefined") {
            return this.toString();
        }
        return toString(Array.prototype.slice.call(this, 0, longestStart)) + "::" + toString(Array.prototype.slice.call(this, longestStart + longestLength));
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

Ipv6Address.from = function(arrLikeOrIterable) {
    return new this(Array.from(arrLikeOrIterable));
};

export default Ipv6Address;
