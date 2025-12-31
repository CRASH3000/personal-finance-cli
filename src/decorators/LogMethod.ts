export function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Вызов метода ${propertyKey} с аргументами: ${JSON.stringify(args)}`);

    const result = original.apply(this, args);

    if (result instanceof Promise) {
      return result.then((resolved: any) => {
        console.log(`Метод ${propertyKey} вернул: ${JSON.stringify(resolved)}`);
        return resolved;
      });
    }

    console.log(`Метод ${propertyKey} вернул: ${JSON.stringify(result)}`);
    return result;
  };

  return descriptor;
}
