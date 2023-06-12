import { expect, test } from 'bun:test';

import debugDriver from '../src/debug.js';

test('basic test', () => {
  const demoNotRecorded = false;

  const demoButton = debugDriver({
    states: {
      isNotRecorded: demoNotRecorded,
      isUploading: true,
      isUploaded: false,
    },
    derived: {
      isDisabled: (states) => states.isNotRecorded || states.isUploading,
      text: {
        isNotRecorded: 'Demo Disabled',
        isUploading: 'Demo Uploading...',
        isUploaded: 'Download Demo',
      },
    },
  });

  expect(demoButton.map((all) => all.activeState)).toEqual([
    'isNotRecorded',
    'isUploading',
    'isUploaded',
  ]);
  expect(demoButton.map((all) => all.text)).toEqual([
    'Demo Disabled',
    'Demo Uploading...',
    'Download Demo',
  ]);
});
