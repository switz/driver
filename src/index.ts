import type { Config, DerivedConfig, Return } from './types';

function driver<const T extends string, K extends DerivedConfig<T>>(
  config: Config<T, K>
): Return<T, K> {
  const activeState = Object.keys(config.states).find((key) => !!config.states[key as T]) as T;

  const stateKeys = Object.keys(config.states);
  const activeEnum = activeState ? stateKeys.indexOf(activeState) : undefined;
  const enums: Record<string, number> = {};
  stateKeys.forEach((key, index) => (enums[key] = index));

  const derived = config.derived ?? config.flags;

  const derivedData = derived
    ? Object.entries(derived).map(([key, value]) => {
        if (typeof value === 'function') {
          return [key, value(config.states, enums, activeEnum)];
        }

        if (Array.isArray(value)) {
          return [key, value.includes(activeState)];
        }

        if (typeof value === 'object') {
          return [key, value[activeState]];
        }

        return [key, value];
      })
    : [];

  return Object.assign({}, Object.fromEntries(derivedData), {
    activeState,
    activeEnum,
    enums,
    states: config.states,
  });
}

export default driver;
