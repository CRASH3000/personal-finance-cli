namespace BudgetTracker {
  export class Transaction implements ITransaction {
    public id: number;
    public amount: number;
    public type: TransactionType;
    public date: string;
    public description: string;

    constructor(
      id: number,
      amount: number,
      type: TransactionType,
      date: string,
      description: string
    ) {
      this.id = id;
      this.amount = amount;
      this.type = type;
      this.date = date;
      this.description = description;
    }

    toString(): string {
      const label: string = this.type === "income" ? "доход" : "расход";
      return `Транзакция #${this.id}: ${this.description} (${label} ${this.amount} ₽) | ${this.date}`;
    }
  }
}
