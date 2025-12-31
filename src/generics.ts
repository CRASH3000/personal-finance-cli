// Интерфейсы
export interface Identifiable {
  id: number;
}

export interface Describable {
  describe(): string;
}

// Универсальный класс GenericStorage<T>
export class GenericStorage<T extends Identifiable> {
  // приватное хранилище
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  removeById(id: number): boolean {
    const index: number = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  getById(id: number): T | undefined {
    return this.items.find((i) => i.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  // describeAll()
  describeAll(): void {
    for (const item of this.items) {
      const maybeDescribable = item as unknown as Partial<Describable>;

      if (typeof maybeDescribable.describe === "function") {
        console.log(maybeDescribable.describe());
      } else {
        console.log(`Элемент id: ${item.id} не содержит описания.`);
      }
    }
  }
}

// Класс Product
export class Product implements Identifiable, Describable {
  public id: number;
  public name: string;
  public price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  describe(): string {
    return `Product #${this.id}: ${this.name}, price: $${this.price}`;
  }
}

// Проверка решения
const productStorage = new GenericStorage<Product>();

productStorage.add(new Product(1, "Ноутбук", 150000));
productStorage.add(new Product(2, "Смартфон", 80000));
productStorage.add(new Product(3, "Планшет", 50000));

// объект с id, но без describe()
productStorage.add({ id: 4 } as Product);

console.log("--- Описание всех продуктов ---");
productStorage.describeAll();
