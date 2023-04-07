type DeriveFn<StateKeys extends string> = (
  states: Record<StateKeys, boolean>,
  stateEnums: Record<string, number>,
  activeEnum: number | undefined
) => unknown;

// type DeriveRecord<StateKeys extends string, K extends object | Function> = K extends Function
//   ? DeriveFn<StateKeys>
//   : K extends object
//   ? K[keyof K]
//   : undefined;

type Config<T extends string, K extends DeriveConfig<T>> = {
  states: Record<T, boolean>;
  derived: K;
};

type DeriveConfig<T extends string> = Record<string, Record<T, unknown> | DeriveFn<T>>;

type Return<T extends string, K extends DeriveConfig<T>> = {
  activeState: T | undefined;
  derived: Record<keyof K, DeriveReturn<T, K[keyof K]>>;
  activeEnum: number | undefined;
  stateEnums: Record<T, number>;
};

type DeriveReturn<
  StateKeys extends string,
  K extends object | DeriveFn<StateKeys>
> = K extends DeriveFn<StateKeys>
  ? ReturnType<DeriveFn<StateKeys>>
  : K extends object
  ? K[keyof K]
  : undefined;

function deriveState<const T extends string, K extends DeriveConfig<T>>(
  config: Config<T, K>
): Return<T, K> {
  const activeState = Object.keys(config.states).find((key) => config.states[key as T]) as T;

  const enums = Object.keys(config.states);
  const activeEnum = activeState ? enums.indexOf(activeState) : undefined;
  const stateEnums: Record<string, number> = {};
  enums.forEach((key, index) => (stateEnums[key] = index));

  const derived = Object.entries(config.derived).map(([key, value]) => {
    if (typeof value === 'function') {
      return [key, value(config.states, stateEnums, activeEnum)];
    }

    if (typeof value === 'object' && typeof activeState === 'string') {
      return [key, value[activeState]];
    }

    return [key, value];
  });

  return {
    activeState,
    derived: Object.fromEntries(derived),
    activeEnum,
    stateEnums,
  };
}

// const flags = fn({
//   states: {
//     hello: true,
//     hello2: false,
//   },
//   derived: {
//     foobar: {
//       hello: 1,
//       hello2: 3,
//     },
//     another: {
//       hello: 'str',
//       hello2: 'foo',
//     },
//     test: (states) => states.hello2,
//   },
// });

export default deriveState;
