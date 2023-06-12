import driver from './index.js';
import type { Config, DerivedConfig, Return } from './types.d.ts';

function driverDebug<const T extends string, K extends DerivedConfig<T>>(
  config: Config<T, K>
): Return<T, K>[] {
  const states = Object.keys(config.states);

  return states.map((stateKey) => {
    const internalStates = states.map((internalStateKey) => [
      internalStateKey,
      internalStateKey === stateKey,
    ]);

    return driver({
      ...config,
      states: Object.fromEntries(internalStates),
    });
  });
}

export default driverDebug;
