import type { Config, DerivedConfig, Return } from './types';

function driver<const T extends string, K extends DerivedConfig<T>>(
  config: Config<T, K>
): Return<T, K> {
  // find the first active state
  const stateKeys = Object.keys(config.states);
  const activeState = stateKeys.find((key) => !!config.states[key as T]) as T;


  // find the enum of the active state
  const activeEnum = activeState ? stateKeys.indexOf(activeState) : undefined;

  // setup all the enums
  const enums: Record<string, number> = {};
  stateKeys.forEach((key, index) => {
    enums[key] = index;

    // state keys must be real strings (not integer strings) otherwise we can't guarantee ordering
    // see: https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order/38218582#38218582

    // this should be reliable in >= ES2020

    // symbols will also break ordering
    // TODO: should we check for them with `Object.getOwnPropertySymbols`?
    if (/^\d+$/.test(key)) throw new Error('State keys can not start with numbers: ' + key);
  });

  // allow the use of the deprecated key flags for old code
  const derived = config.derived ?? config.flags;

  // map over every derived key
  const derivedData = derived
    ? Object.entries(derived).map(([key, value]) => {
        // if the value is a function, call the function w/ (states, enums, activeEnum)
        if (typeof value === 'function') {
          return [key, value(config.states, enums, activeEnum)];
        }

        // if the value is an array, check if the active state is in it
        if (Array.isArray(value)) {
          return [key, value.includes(activeState)];
        }

        // if the value is an object, lookup the active state's key
        if (typeof value === 'object') {
          return [key, value[activeState]];
        }

        // otherwise just return the object as we started
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
