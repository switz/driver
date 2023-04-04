type Metadata = Record<string, string>;

type DeriveFn = (states: Config['states']) => boolean;

interface Config {
  states: Record<string, boolean>;
  derived: Record<string, DeriveFn | Metadata>;
}

interface DerivedData {
  activeState: string | undefined;
  derived: Record<string, boolean | string>;
}

const useDeriver = (config: Config): DerivedData => {
  const activeValue = Object.entries(config.states).find(([key, value]) => value);
  const activeState = activeValue?.[0];

  const derived = 
    Object.entries(config.derived).map(([key, value]) => {
      if (typeof value === 'function') {
        return [key, value(config.states)];
      }

      if (typeof value === 'object' && typeof activeState === 'string') {
        return [key, value[activeState]];
      }

      return [key, value];
    });

  return {
    activeState,
    derived: Object.fromEntries(derived) satisfies Record<string, boolean | string>,
  };
};

export default useDeriver;