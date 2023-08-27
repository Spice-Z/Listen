import { expect, test } from 'vitest';
import { getTotalSeconds } from './duration';
test('100 number', () => {
  expect(getTotalSeconds(100)).toBe(100);
});

test('100 string', () => {
  expect(getTotalSeconds('100')).toBe(100);
});

test('10:10', () => {
  expect(getTotalSeconds('10:10')).toBe(610);
});

test('10:10:10', () => {
  expect(getTotalSeconds('10:10:10')).toBe(36610);
});

test('05:05', () => {
  expect(getTotalSeconds('05:05')).toBe(305);
});
