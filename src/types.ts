export type Provider =
  | InstancableDependencyProvider
  | NonInstancableDependencyProvider;

export type InstancableDependencyProvider = {
  token: any;
  useClass: Function;
  singleton?: boolean;
};

export type NonInstancableDependencyProvider = {
  token: any;
  useValue: () => any;
};
