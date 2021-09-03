### Механизм инжектирования зависимостей для TypeScript приложений

Идея данной либы позаимствована из Angular, и ощутимо упрощена. 

Поддерживаются два основных типа зависимотей

1. Инстанцируемые - классы, инстансы которых будут созданы при инжектировании (один раз, либо при каждом инжектировании если указан singleton: false)
2. Не инстанцируемые - ими могут являться любые типы данных. 

Все зависимости регистрируются в IoC контейнере, и доступны в его пределах, включая сам инстанс контейнера из которого так же можно вытащить любую зависимость. 

Для инжектирования зависимостей в конструктор без без явного указания токена через декоратор Inject, к классу должен быть применен декоратор Injectable, в таком случае для инстанцируемой зависимости достаточно будет указать класс в качестве ее типа.

Послед создания контейнера требуется зарегистрировать зависимости (провайдеры) с помощью метода provideDependency, который принимает три типа провайдеров. 
    
    @Injectable()
    class ClassDependency {}
    
    @Injectable()
    class TestClass {
      constructor(
          public dependency: ClassDependency
        ) {}
    }

    const container = new Container();
    container.provideDependencies([ClassDependency, TestClass]);

    const testClassInstance = container.getDependency<TestClass>(TestClass);

    expect(testClassInstance.dependency).toBeInstanceOf(ClassDependency);

Для каждой зависимости требуется инжектирующий токен, под которым она будет зарегистрирована и доступна для инжектирования. В случае передачи провайдера как функции (класса), в качестве токена и зависимости будет использован сам класс. Так же мы можем передать обьект, в котором можно отдельно указать токен, зависимость и если это класс, указать должен ли он быть синглтоном. 

    const INJECTION_TOKEN = Symbol();
    
    @Injectable()
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

Пример провайдинга и инжектирования не синглтонных зависимостей:

    const INJECTION_TOKEN = Symbol();
    
    @Injectable()
    class ClassDependency {}

    @Injectable()
    class TestClass {
      constructor(
        @Inject(INJECTION_TOKEN) public dependency1: ClassDependency,
        @Inject(INJECTION_TOKEN) public dependency2: ClassDependency,
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
  
  Пример провайдинга и инжектирования произвольных типов данных, в провайдере передается функция возвращаемое значение которой, будет заинжектировано: 
  
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
  
  
