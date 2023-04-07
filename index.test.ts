import { expect, test } from 'bun:test';

import driver from './index.js';

test('basic test', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    flags: {
      isDisabled: (states) => states.isNotRecorded || states.isUploading,
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

test('ensure order works test', () => {
  const demoButton = driver({
    states: {
      isNotRecorded: true,
      isUploading: true,
      isUploaded: false,
    },
    flags: {
      isDisabled: (state) => state.isNotRecorded || state.isUploading,
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe('isNotRecorded');
  expect(demoButton.isDisabled).toBe(true);
  expect(demoButton.text).toBe('Demo Disabled');
});
