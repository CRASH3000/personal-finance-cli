export function ReadOnly(target: any, propertyKey: string): void {
  const storage = new WeakMap<object, unknown>();

  Object.defineProperty(target, propertyKey, {
    get() {
      return storage.get(this);
    },
    set(value: unknown) {
      if (storage.has(this)) {
        throw new Error(`Свойство ${propertyKey} доступно только для чтения`);
      }
      storage.set(this, value);
    },
    enumerable: true,
    configurable: false
  });
}
