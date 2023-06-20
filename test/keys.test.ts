import { expect, test } from 'bun:test';

import driver from '../src/index.js';

test('basic key error test', () => {
  const demoNotRecorded = false;

  expect(() =>
    driver({
      states: {
        'isNotRecorded': demoNotRecorded,
        '0': true,
        'isUploaded': false,
      },
      derived: {
        isDisabled: ['isNotRecorded', 'isUploading'],
        text: {
          isNotRecorded: 'Demo Disabled',
          0: 'Demo Uploading...',
          isUploaded: 'Download Demo',
        },
      },
    })
  ).toThrow();
});
