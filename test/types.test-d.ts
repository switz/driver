import { expectType } from 'tsd';
import driver from '../src/index';

const flags = driver({
  states: {
    hello: true,
  },
  flags: {
    isDisabled: (states) => states.hello,
  },
});

expectType<boolean>(flags.isDisabled);
expectType<number | undefined>(flags.activeEnum);
expectType<'hello' | undefined>(flags.activeState);
expectType<Record<'hello', number>>(flags.stateEnums);
