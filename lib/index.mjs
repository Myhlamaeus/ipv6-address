import { IPv6Address } from './IPv6Address';

export { IPv6Address };

export function parse(val) {
  return IPv6Address.parse(val);
}

export default function(val) {
  if (typeof val === 'string') {
    return parse(val);
  }

  return IPv6Address.from(val);
}
