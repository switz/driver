import { expectType, expectError } from 'tsd';
import driver from '../src/index';

const derived = driver({
  states: {
    hello: true,
    foobar: false,
    test: undefined,
  },
  derived: {
    isDisabled: (states) => states.hello,
    optionalParams: {
      foobar: 'hi',
    },
  },
});

expectType<boolean | undefined>(derived.isDisabled);
expectType<number | undefined>(derived.activeEnum);
expectType<'hello' | 'foobar' | 'test' | undefined>(derived.activeState);
expectType<Record<'hello' | 'foobar' | 'test', number>>(derived.stateEnums);
expectType<string>(derived.optionalParams);

// expect an error because no params are passed into a flag
expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    derived: {
      isDisabled: (states) => states.hello,
      noParams: {},
    },
  })
);
