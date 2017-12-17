import needleString from 'needle-string';
import leftPad from 'left-pad';
import { setExpectedLength } from 'fixed-length-arrays/lib/factory';
import FixedLengthUint16Array from 'fixed-length-arrays/lib/FixedLengthUint16Array';

const partsLength = 8;
const separator = ':';
const placeholder = separator.repeat(2);

function toString(arr, shorten, ...sliceArgs) {
  if (!shorten || sliceArgs.length) {
    arr = Array.from(arr).slice(...sliceArgs);
  }

  if (!shorten) {
    arr = arr.map(n => leftPad(n, 4, '0'));
  }

  return arr.join(separator);
}

function toShortenedString(arr) {
  let sequenceLength = 0;
  let sequenceStart;

  let longestSequenceLength = 0;
  let longestSequenceStart;

  for (const [key, val] of arr.entries()) {
    if (val === 0) {
      if (!sequenceLength) {
        sequenceStart = key;
      }

      ++sequenceLength;
    }

    if (sequenceLength > longestSequenceLength) {
      longestSequenceStart = sequenceStart;
      longestSequenceLength = sequenceLength;
    }

    if (val) {
      sequenceLength = 0;
    }
  }

  // https://tools.ietf.org/html/rfc5952#section-4.2.2
  // ‘The symbol "::" MUST NOT be used to shorten just one 16-bit 0 field.’
  if (longestSequenceLength > 1) {
    return (
      toString(arr, true, 0, longestSequenceStart) +
      separator.repeat(2) +
      toString(arr, true, longestSequenceStart + longestSequenceLength)
    );
  }

  return toString(arr, true);
}

function insertOmittedZeroes(str) {
  const placeholderCount = needleString(str, placeholder);
  if (placeholderCount > 1) {
    throw new TypeError(`'${placeholder}' must occur at most once`);
  }

  if (placeholderCount) {
    const separatorCount = needleString(str, separator) - placeholderCount * 2;
    const atStart = str.startsWith(placeholder);
    const atEnd = str.endsWith(placeholder);

    return str.replace(
      new RegExp(placeholder),
      (atStart ? '' : separator) +
        new Array(partsLength - separatorCount - !atStart - !atEnd)
          .fill('0')
          .join(separator) +
        (atEnd ? '' : separator)
    );
  }

  return str;
}

export default class IPv6Address extends FixedLengthUint16Array {
  toString({ shorten = true } = {}) {
    if (shorten) {
      return toShortenedString(this);
    }

    return toString(this, shorten);
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      throw new Error("IPv6 addresses are too long for JavaScript's Number type");
    }

    return this.toString();
  }
}

setExpectedLength(IPv6Address, partsLength);

Object.defineProperties(IPv6Address, {
  parse: {
    value(str) {
      str = insertOmittedZeroes(str);

      const parts = str.split(separator).map(part => parseInt(part, 16));

      if (parts.some(part => isNaN(part))) {
        throw new TypeError("Some parts of the IP address aren't numbers");
      }

      return new this(parts);
    },
    writable: true,
    configurable: true
  }
});
