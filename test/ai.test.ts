// these were written with ai?

import { test, expect } from 'bun:test';
import driver from '../src/index.js';

test('state key ordering', () => {
  const result = driver({
    states: { a1: true, a2: false },
  });
  expect(result.activeState).toBe('a1');
  expect(result.activeEnum).toBe(0);
  expect(Object.keys(result.enums)).toEqual(['a1', 'a2']);
});

test('derived keys with undefined values', () => {
  const result = driver({
    states: { a: true, b: false },
    derived: { foo: undefined },
  });
  expect(result.foo).toBeUndefined();
});

test('derived keys with falsy values', () => {
  const result = driver({
    states: { a: true, b: false },
    derived: { foo: 0, bar: false },
  });
  expect(result.foo).toBe(0);
  expect(result.bar).toBe(false);
});

test('derived keys with functions', () => {
  const result = driver({
    states: { a: true, b: false },
    derived: { foo: (states, enums) => Object.keys(states).length },
  });
  expect(result.foo).toBe(2);
});

test('derived keys with arrays', () => {
  const result = driver({
    states: { a: true, b: false },
    derived: { foo: ['a', 'c'] },
  });
  expect(result.foo).toBe(true);
});

test('derived keys with objects', () => {
  const result = driver({
    states: { a: true, b: false },
    derived: { foo: { a: 'bar', b: 'baz' } },
  });
  expect(result.foo).toBe('bar');
});

test('empty states', () => {
  const result = driver({ states: {} });
  expect(result.activeState).toBeUndefined();
  expect(result.activeEnum).toBeUndefined();
  expect(result.enums).toEqual({});
});

test('no active state', () => {
  const result = driver({ states: { a: false, b: false } });
  expect(result.activeState).toBeUndefined();
  expect(result.activeEnum).toBeUndefined();
});

test('invalid state key type', () => {
  expect(() => driver({ states: { 1: true } })).toThrow();
});

test('invalid derived key type', () => {
  expect(() =>
    driver({
      states: { a: true },
      derived: { foo: 123 },
    })
  ).not.toThrow();
});
