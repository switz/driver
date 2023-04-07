import { expect, test } from 'bun:test';

import driver from './index.js';

test('basic enum test', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    flags: {
      isDisabled: (state, stateEnums, activeEnum) =>
        stateEnums.isUploading <= (activeEnum ?? Infinity),
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
      isDisabled: (state, stateEnums, activeEnum) =>
        stateEnums.isUploading <= (activeEnum ?? Infinity),
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
