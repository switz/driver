import { expect, test } from 'bun:test';

import deriveState from './index.js';

test('basic enum test', () => {
  const demoNotRecorded = false;

  const flags = deriveState({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    derived: {
      buttonIsDisabled: (state, stateEnums, activeEnum) =>
        stateEnums.isUploading <= (activeEnum ?? Infinity),
      buttonText: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(flags.activeState).toBe('isUploading');
  expect(flags.derived.buttonIsDisabled).toBe(true);
  expect(flags.derived.buttonText).toBe('Demo Uploading...');
});

test('basic enum test2', () => {
  const demoNotRecorded = false;

  const flags = deriveState({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: false,
      isUploaded: true,
    },
    derived: {
      buttonIsDisabled: (state, stateEnums, activeEnum) =>
        stateEnums.isUploading <= (activeEnum ?? Infinity),
      buttonText: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(flags.activeState).toBe('isUploaded');
  expect(flags.derived.buttonIsDisabled).toBe(false);
  expect(flags.derived.buttonText).toBe('Download Demo');
});
