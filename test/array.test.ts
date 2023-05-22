import { expect, test } from 'bun:test';

import driver from '../src/index.js';

test('basic array test', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    flags: {
      isDisabled: ['isNotRecorded', 'isUploading'],
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe('isUploading');
  expect(demoButton.isDisabled).toBe(true);
  expect(demoButton.text).toBe('Demo Uploading...');
});

test('basic enum test2', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: false,
      isUploaded: true,
    },
    flags: {
      isDisabled: ['isNotRecorded', 'isUploading'],
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe('isUploaded');
  expect(demoButton.isDisabled).toBe(false);
  expect(demoButton.text).toBe('Download Demo');
});

test('array test when no state value is true', () => {
  const demoButton = driver({
    states: {
      isNotRecorded: false,
      isUploading: false,
      isUploaded: false,
    },
    flags: {
      isDisabled: ['isNotRecorded', 'isUploading'],
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe(undefined);
  expect(demoButton.isDisabled).toBe(false);
  expect(demoButton.text).toBe(undefined);
});
