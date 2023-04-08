type Config<T extends string, K extends FlagsConfig<T>> = {
  states: Record<T, boolean>;
  flags: K;
};

type FlagsConfig<T extends string> = Record<string, Record<T, unknown> | FlagFn<T>>;

type FlagFn<StateKeys extends string> = (
  states: Record<StateKeys, boolean>,
  stateEnums: Record<string, number>,
  activeEnum: number | undefined
) => unknown;

type Return<T extends string, K extends FlagsConfig<T>> = Record<
  keyof K,
  FlagsReturn<T, K[keyof K]>
> & {
  activeState: T | undefined;
  activeEnum: number | undefined;
  stateEnums: Record<T, number>;
};

// type FlagRecord<StateKeys extends string, K extends object | Function> = K extends Function
//   ? FlagFn<StateKeys>
//   : K extends object
//   ? K[keyof K]
//   : undefined;

type FlagsReturn<
  StateKeys extends string,
  K extends object | FlagFn<StateKeys>
> = K extends FlagFn<StateKeys>
  ? ReturnType<FlagFn<StateKeys>>
  : K extends object
  ? K[keyof K]
  : undefined;

function driver<const T extends string, K extends FlagsConfig<T>>(
  config: Config<T, K>
): Return<T, K> {
  const activeState = Object.keys(config.states).find((key) => config.states[key as T]) as T;

  const stateKeys = Object.keys(config.states);
  const activeEnum = activeState ? stateKeys.indexOf(activeState) : undefined;
  const enums: Record<string, number> = {};
  stateKeys.forEach((key, index) => (enums[key] = index));

  const flags = Object.entries(config.flags).map(([key, value]) => {
    if (typeof value === 'function') {
      return [key, value(config.states, enums, activeEnum)];
    }

    if (typeof value === 'object' && typeof activeState === 'string') {
      return [key, value[activeState]];
    }

    return [key, value];
  });

  return {
    ...Object.fromEntries(flags),
    activeState,
    activeEnum,
    enums,
  };
}

export default driver;
