type FlagFn<StateKeys extends string> = (
  states: Record<StateKeys, boolean>,
  stateEnums: Record<StateKeys, number>,
  activeEnum: number | undefined
) => unknown;

type Config<T extends string, K extends FlagsConfig<T>> = {
  states: Record<T, boolean>;
  flags: K;
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type FlagsConfig<T extends string> = Record<
  string | symbol | number,
  RequireAtLeastOne<Partial<Record<T, unknown>>, T> | FlagFn<T> | T[]
>;

type Return<T extends string, K extends FlagsConfig<T>> = FlagsReturn<T, K> & {
  activeState: T | undefined;
  activeEnum: number | undefined;
  stateEnums: Record<T, number>;
};

type FlagsReturn<StateKeys extends string, K extends FlagsConfig<StateKeys>> = {
  [P in keyof K]: K[P] extends FlagFn<StateKeys>
    ? ReturnType<K[P]>
    : K[P] extends Array<StateKeys>
    ? boolean
    : K[P] extends object
    ? K[P][keyof K[P]]
    : undefined;
};
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

    if (typeof activeState === 'string') {
      if (Array.isArray(value)) {
        return [key, value.includes(activeState)];
      }

      if (typeof value === 'object') {
        return [key, value[activeState]];
      }
    }

    return [key, value];
  });

  return Object.assign({}, Object.fromEntries(flags), { activeState, activeEnum, enums });
}

export default driver;
