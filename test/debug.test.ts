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

  expect(String(demoButton.map((all) => all.activeState))).toBe(
    String(['isNotRecorded', 'isUploading', 'isUploaded', undefined])
  );
  expect(String(demoButton.map((all) => all.text))).toBe(
    String(['Demo Disabled', 'Demo Uploading...', 'Download Demo', undefined])
  );
});
