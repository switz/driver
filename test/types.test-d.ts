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
expectType<Record<'hello' | 'foobar' | 'test', number>>(derived.enums);
expectType<string | undefined>(derived.optionalParams);

const allDerived = driver({
  states: {
    hello: false,
    foobar: false,
    test: undefined,
  },
  derived: {
    params: {
      hello: 'hello',
      foobar: 'hi',
      test: 'foo',
    },
  },
});

expectType<string | undefined>(allDerived.params);

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

// protected derived keys
expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    derived: {
      enums: {
        foo: 1,
      },
    },
  })
);

expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    derived: {
      activeEnum: {
        foo: 1,
      },
    },
  })
);
expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    derived: {
      states: {
        foo: 1,
      },
    },
  })
);
expectError(
  driver({
    states: {
      hello: true,
      foobar: false,
    },
    derived: {
      activeState: {
        foo: 1,
      },
    },
  })
);
