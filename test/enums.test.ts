import { expect, test } from 'bun:test';

import driver from '../src/index.js';

test('basic enum test', () => {
  const demoNotRecorded = false;

  const demoButton = driver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    derived: {
      isDisabled: (_, enums, activeEnum) => (activeEnum ?? 0) <= enums.isUploading,
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
    derived: {
      isDisabled: (_, enums, activeEnum) => (activeEnum ?? 0) <= enums.isUploading,
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

test('enums: when no state is true', () => {
  const demoButton = driver({
    states: {
      isNotRecorded: false,
      isUploading: false,
      isUploaded: false,
    },
    derived: {
      isDisabled: (_, enums, activeEnum) => (activeEnum ?? 0) <= enums.isUploading,
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.activeState).toBe(undefined);
  expect(demoButton.isDisabled).toBe(true);
  expect(demoButton.text).toBe(undefined);
});
