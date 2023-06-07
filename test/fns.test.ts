import { expect, test } from 'bun:test';

import driver from '../src/index.js';

test('basic fn test', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    derived: {
      isDisabled: (states) => (states.isNotRecorded || states.isUploading ? 1000 : 10),
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe('isUploading');
  expect(demoButton.isDisabled).toBe(1000);
  expect(demoButton.text).toBe('Demo Uploading...');
});

test('basic fn test 2', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: false,
      isUploaded: true,
    },
    derived: {
      isDisabled: (states) => (states.isNotRecorded || states.isUploading ? 1000 : 10),
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe('isUploaded');
  expect(demoButton.isDisabled).toBe(10);
  expect(demoButton.text).toBe('Download Demo');
});

test('fns: when no state is true', () => {
  const demoButton = driver({
    states: {
      isNotRecorded: false,
      isUploading: false,
      isUploaded: false,
    },
    derived: {
      isDisabled: (states) => (states.isNotRecorded || states.isUploading ? 1000 : 10),
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe(undefined);
  expect(demoButton.isDisabled).toBe(10);
  expect(demoButton.text).toBe(undefined);
});
