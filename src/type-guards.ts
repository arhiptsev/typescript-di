import {
  InstancableDependencyProvider,
  NonInstancableDependencyProvider,
} from "./types";

export function isFunction(key: any): key is Function {
  return typeof key === "function";
}

export function isInstancableDependencyProvider(
  key: any
): key is InstancableDependencyProvider {
  return !!key.useClass;
}

export function isNonInstancableDependencyProvider(
  key: any
): key is NonInstancableDependencyProvider {
  return !!key.useValue;
}
