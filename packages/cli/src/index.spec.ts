import { describe, it, expect } from 'vitest';
import { getVersion } from './index';

describe('CLI', () => {
  it('should return a version string', () => {
    const version = getVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });
});
