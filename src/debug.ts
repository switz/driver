import driver from './index.js';
import type { Config, DerivedConfig, Return } from './types.d.ts';

function debugDriver<const T extends string, K extends DerivedConfig<T>>(
  config: Config<T, K>
): Return<T, K>[] {
  const states = Object.keys(config.states);

  // injects a __debug_noMatches__ state key to show what happens when all state keys are false
  return states.concat('__debug_noMatches__').map((stateKey) => {
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

export default debugDriver;
