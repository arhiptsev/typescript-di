import "reflect-metadata";

import { Inject } from "./inject";
import { Injectable } from "./injectable";

const TEST_TOKEN = Symbol();

describe("Testing inject decorator", () => {
  it("To be set metadata", () => {

    @Injectable()
    class TestClass {
      constructor(@Inject(TEST_TOKEN) test) {}
    }

    const constructorArguments = Reflect.getMetadata(
      "design:paramtypes",
      TestClass
    );

    expect(constructorArguments).toContain(TEST_TOKEN);
  });
});
