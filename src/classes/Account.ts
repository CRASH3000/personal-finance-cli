namespace BudgetTracker {
  export class Account implements IAccount, ISummary {
    public id: number;
    public name: string;
    public transactions: Transaction[] = [];

    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }

    get income(): number {
      let sum: number = 0;
      for (const t of this.transactions) {
        if (t.type === "income") sum += t.amount;
      }
      return sum;
    }

    get expenses(): number {
      let sum: number = 0;
      for (const t of this.transactions) {
        if (t.type === "expense") sum += t.amount;
      }
      return sum;
    }

    get balance(): number {
      return this.income - this.expenses;
    }

    addTransaction(transaction: ITransaction): void {
      // ожидаем, что передаём Transaction, но интерфейс допускаем по заданию
      if (transaction instanceof Transaction) {
        this.transactions.push(transaction);
        return;
      }

      this.transactions.push(
        new Transaction(
          transaction.id,
          transaction.amount,
          transaction.type,
          transaction.date,
          transaction.description
        )
      );
    }

    removeTransactionById(transactionId: number): boolean {
      const index: number = this.transactions.findIndex((t) => t.id === transactionId);
      if (index === -1) return false;
      this.transactions.splice(index, 1);
      return true;
    }

    getTransactions(): ITransaction[] {
      return this.transactions;
    }

    getSummary(): ISummary {
      return { income: this.income, expenses: this.expenses, balance: this.balance };
    }

    getSummaryString(): string {
      return `${this.name}: баланс ${this.balance} ₽, транзакций ${this.transactions.length}`;
    }

    toString(): string {
      const lines: string[] = [];
      lines.push(`${this.id}) ${this.name}`);
      lines.push(`Список транзакций:`);

      if (this.transactions.length === 0) {
        lines.push("— (пусто)");
        return lines.join("\n");
      }

      for (const t of this.transactions) {
        lines.push(`${t.id}) ${t.description} | ${t.type} ${t.amount} ₽ | ${t.date}`);
      }

      return lines.join("\n");
    }
  }
}
