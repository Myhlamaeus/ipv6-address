import { IPv6Address } from './IPv6Address';

export { IPv6Address };

export function parse(addr) {
  return IPv6Address.parse(addr);
}

export default function(addr) {
  if (typeof addr === 'string') {
    return parse(addr);
  }

  return IPv6Address.from(addr);
}
