type ProtectedKeys = keyof MetadataReturn<any>;

type ProtectedObject<T extends object> = T & {
  [P in ProtectedKeys]?: never;
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type DerivedFn<StateKeys extends string> = (
  states: Record<StateKeys, boolean | undefined>,
  stateEnums: Record<StateKeys, number>,
  activeEnum: number | undefined
) => unknown;

export type Config<T extends string, K extends DerivedConfig<T>> = {
  states: Record<T, boolean | undefined>;
  /**
   * @deprecated the `flags` field has been renamed to derived, please transition your code
   */
  flags?: ProtectedObject<K>;
  derived?: ProtectedObject<K>;
};

export type DerivedConfig<T extends string> = Record<
  string,
  RequireAtLeastOne<Partial<Record<T, unknown>>, T> | DerivedFn<T> | T[]
>;

export type Return<T extends string, K extends DerivedConfig<T>> = DerivedReturn<T, K> &
  MetadataReturn<T>;

type MetadataReturn<T extends string> = {
  activeState: T | undefined;
  activeEnum: number | undefined;
  stateEnums: Record<T, number>;
  states: Record<T, boolean | undefined>;
};

type DerivedReturn<StateKeys extends string, K extends DerivedConfig<StateKeys>> = {
  [P in keyof K]: K[P] extends DerivedFn<StateKeys>
    ? ReturnType<K[P]>
    : K[P] extends Array<StateKeys>
    ? boolean
    : K[P] extends object
    ? K[P][keyof K[P]]
    : undefined;
};
