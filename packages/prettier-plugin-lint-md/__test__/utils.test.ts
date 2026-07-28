import { expect, test } from 'vitest';
import { getRules, readJson } from '../src/utils';

test(`readJson`, () => {
  expect(readJson('./package.json')?.name).toBeTypeOf('string');
  expect(readJson('./package1.json')).toBeNull();
});

test(`getRules`, () => {
  expect(getRules()).toHaveProperty('no-space-in-inline-code');
  expect(getRules()).toHaveProperty('no-full-width-number');
  expect(getRules()).toHaveProperty('no-half-width-punctuation');
  expect(getRules()).not.toHaveProperty('no-fullwidth-number');
  expect(Object.keys(getRules())).toHaveLength(17);
});
