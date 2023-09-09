import { expect, it, describe } from 'vitest';
import { compareSemVer } from './semVer';

describe('compareSemVer', () => {
  it('should compare major versions correctly', () => {
    expect(compareSemVer('2.0.0', '1.0.0')).toBe(1);
    expect(compareSemVer('1.0.0', '2.0.0')).toBe(-1);
    expect(compareSemVer('1.0.0', '1.0.0')).toBe(0);
  });

  it('should compare minor versions correctly', () => {
    expect(compareSemVer('1.2.0', '1.1.0')).toBe(1);
    expect(compareSemVer('1.1.0', '1.2.0')).toBe(-1);
    expect(compareSemVer('1.1.0', '1.1.0')).toBe(0);
  });

  it('should compare patch versions correctly', () => {
    expect(compareSemVer('1.0.2', '1.0.1')).toBe(1);
    expect(compareSemVer('1.0.1', '1.0.2')).toBe(-1);
    expect(compareSemVer('1.0.1', '1.0.1')).toBe(0);
  });
});
