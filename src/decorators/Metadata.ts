import "reflect-metadata";

export function Metadata(key: string, value: any) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(key, value, target, propertyKey);
  };
}

export function getMetadataValue<T>(key: string, target: object, propertyKey: string): T | undefined {
  return Reflect.getMetadata(key, target, propertyKey) as T | undefined;
}
