import {
  InstancableDependencyProvider,
  NonInstancableDependencyProvider,
  Provider,
} from "./types";
import {
  isFunction,
  isInstancableDependencyProvider,
  isNonInstancableDependencyProvider,
} from "./type-guards";

export class Container {
  private dependencies = new Map<
    any,
    | Omit<NonInstancableDependencyProvider, "token">
    | Omit<InstancableDependencyProvider, "token">
  >();

  private singletonDependencyInstances = new Map<any, any>();

  constructor() {
    this.dependencies.set(Container, {
      useValue: () => this,
    });
  }

  public provideDependencies(providers: Array<Provider | Function>): void {
    providers.forEach((provider) => {
      isFunction(provider) && this.setFunctionDependency(provider);
      isInstancableDependencyProvider(provider) &&
        this.setInstancableDependency(provider);
      isNonInstancableDependencyProvider(provider) &&
        this.setNonInstancableDependency(provider);
    });
  }

  public getDependency<T = any>(token: any): T {
    const provider = this.dependencies.get(token);

    if (isNonInstancableDependencyProvider(provider)) {
      return provider.useValue();
    }

    if (isInstancableDependencyProvider(provider)) {
      return this.getInstancableDependency({ token, ...provider });
    }
  }

  private getInstancableDependency({
    token,
    useClass,
    singleton,
  }: InstancableDependencyProvider): any {
    if (this.singletonDependencyInstances.has(token)) {
      return this.singletonDependencyInstances.get(token);
    }
    const instance = this.getDependencyInstance(useClass);

    if (singleton) {
      this.singletonDependencyInstances.set(token, instance);
    }

    return instance;
  }

  private getDependencyInstance(target): any {
    const deps = this.getDependencies(target);
    const depInstances = deps.map((d) => this.getDependency(d));
    return new target(...depInstances);
  }

  private setFunctionDependency(func: Function): void {
    this.dependencies.set(func, {
      useClass: func,
      singleton: true,
    });
  }

  private setInstancableDependency({
    token,
    useClass,
    singleton = true,
  }: InstancableDependencyProvider): void {
    this.dependencies.set(token, {
      useClass,
      singleton,
    });
  }

  private setNonInstancableDependency({
    token,
    useValue,
  }: NonInstancableDependencyProvider): void {
    this.dependencies.set(token, {
      useValue,
    });
  }

  private getDependencies(constructor: any): any[] {
    return Reflect.getMetadata("design:paramtypes", constructor) || [];
  }
}
