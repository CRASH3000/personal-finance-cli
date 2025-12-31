export function LogClass<T extends new (...args: any[]) => object>(Base: T): T {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      console.log(
        `Создан экземпляр класса ${Base.name} с аргументами: ${JSON.stringify(args)}`
      );
    }
  } as T;
}
