export type Generic<T> = {
  [K in keyof T]: T[K];
};
