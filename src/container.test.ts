import "reflect-metadata";
import { Container } from "./container";

import { Injectable, Inject } from "./decorators";

describe("Testing IoC container", () => {
  it("To be instanced Class", () => {
    @Injectable()
    class TestClass {}

    const container = new Container();
    container.provideDependencies([TestClass]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance).toBeInstanceOf(TestClass);
  });

  it("To be inject Class dependency", () => {
    @Injectable()
    class ClassDependency {}

    @Injectable()
    class TestClass {
      constructor(public dependency: ClassDependency) {}
    }

    const container = new Container();
    container.provideDependencies([ClassDependency, TestClass]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance.dependency).toBeInstanceOf(ClassDependency);
  });

  it("To be inject Class dependency by token", () => {
    const INJECTION_TOKEN = Symbol();

    // @Injectable()
    class ClassDependency {}

    @Injectable()
    class TestClass {
      constructor(
        @Inject(INJECTION_TOKEN) public dependency: ClassDependency
      ) {}
    }

    const container = new Container();
    container.provideDependencies([
      { token: INJECTION_TOKEN, useClass: ClassDependency },
      TestClass,
    ]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance.dependency).toBeInstanceOf(ClassDependency);
  });

  it("To be inject non-singleton Class dependency by token", () => {
    const INJECTION_TOKEN = Symbol();

    @Injectable()
    class ClassDependency {}

    @Injectable()
    class TestClass {
      constructor(
        @Inject(INJECTION_TOKEN) public dependency1: ClassDependency,
        @Inject(INJECTION_TOKEN) public dependency2: ClassDependency,
        @Inject(INJECTION_TOKEN) public dependency3: ClassDependency
      ) {}
    }

    const container = new Container();
    container.provideDependencies([
      { token: INJECTION_TOKEN, useClass: ClassDependency, singleton: false },
      TestClass,
    ]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance.dependency1).not.toBe(
      testClassInstance.dependency2
    );
    expect(testClassInstance.dependency1).not.toBe(
      testClassInstance.dependency3
    );
    expect(testClassInstance.dependency2).not.toBe(
      testClassInstance.dependency3
    );
  });

  it("To be inject any value dependency by token", () => {
    const INJECTION_TOKEN = Symbol();

    @Injectable()
    class TestClass {
      constructor(@Inject(INJECTION_TOKEN) public dependency: string) {}
    }

    const container = new Container();
    container.provideDependencies([
      {
        token: INJECTION_TOKEN,
        useValue: () => "test string",
        singleton: false,
      },
      TestClass,
    ]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance.dependency).toBe("test string");
  });
});
