import needleString from 'needle-string';

const partsLength = 8;
const separator = ':';
const placeholder = separator.repeat(2);

function toString(arr, expanded) {
  if (expanded) {
    arr = Array.from(arr).map(n => String(n).padStart(4, 0));
  }

  return arr.join(separator);
}

function removeOmittedZeroes(str) {
  const placeholderCount = needleString(str, placeholder);
  if (placeholderCount > 1) {
    throw new TypeError(`IPv6Address: '${placeholder}' must occur at most once`);
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

export default class IPv6Address extends Uint16Array {
  constructor(init = partsLength, ...otherArgs) {
    super(init, ...otherArgs);

    if (this.length !== partsLength) {
      throw new RangeError(`IPv6Address: Length must be ${partsLength}`);
    }
  }

  toString(expanded = false) {
    if (!expanded) {
      let sequenceLength = 0;
      let sequenceStart;

      let longestSequenceLength = 0;
      let longestSequenceStart;

      for (const [key, val] of this.entries()) {
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
          toString(Array.prototype.slice.call(this, 0, longestSequenceStart), expanded) +
          separator.repeat(2) +
          toString(
            Array.prototype.slice.call(
              this,
              longestSequenceStart + longestSequenceLength
            ),
            expanded
          )
        );
      }
    }

    return toString(this, expanded);
  }
}

Object.defineProperties(IPv6Address, {
  parse: {
    value: function(str) {
      str = removeOmittedZeroes(str);

      const parts = str.split(separator).map(part => parseInt(part, 16));

      if (parts.some(part => isNaN(part))) {
        throw new TypeError("IPv6Address: Some parts of the IP address aren't numbers");
      }

      return new this(parts);
    },
    writable: true,
    configurable: true
  }
});
