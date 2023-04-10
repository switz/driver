import { expectType } from 'tsd';
import driver from '../src/index';
import { expectError } from 'tsd';

const flags = driver({
  states: {
    hello: true,
    foobar: false,
  },
  flags: {
    isDisabled: (states) => states.hello,
    optionalParams: {
      foobar: 'hi',
    },
  },
});

expectType<boolean>(flags.isDisabled);
expectType<number | undefined>(flags.activeEnum);
expectType<'hello' | 'foobar' | undefined>(flags.activeState);
expectType<Record<'hello' | 'foobar', number>>(flags.stateEnums);
expectType<string>(flags.optionalParams);

// expect an error because no params are passed into a flag
expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    flags: {
      isDisabled: (states) => states.hello,
      noParams: {},
    },
  })
);
