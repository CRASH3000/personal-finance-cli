import { IAccount, IAccountManager, ISummary, ITransaction, TransactionType } from "./types";

// Transaction реализует ITransaction
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

// Account реализует IAccount и ISummary
export class Account implements IAccount, ISummary {
  public id: number;
  public name: string;
  public transactions: Transaction[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  // геттеры ISummary
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

  // методы IAccount
  addTransaction(transaction: ITransaction): void {
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
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
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

// AccountManager реализует IAccountManager и ISummary
export class AccountManager implements IAccountManager, ISummary {
  public accounts: Account[] = [];

  // геттеры ISummary (по всем счетам)
  get income(): number {
    let sum: number = 0;
    for (const a of this.accounts) {
      sum += a.income;
    }
    return sum;
  }

  get expenses(): number {
    let sum: number = 0;
    for (const a of this.accounts) {
      sum += a.expenses;
    }
    return sum;
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  // методы менеджера
  addAccount(account: Account): void {
    this.accounts.push(account);
  }

  removeAccountById(accountId: number): boolean {
    const index: number = this.accounts.findIndex((a) => a.id === accountId);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    return true;
  }

  getAccountById(id: number): Account | undefined {
    return this.accounts.find((a) => a.id === id);
  }

  getAllAccounts(): Account[] {
    return this.accounts;
  }

  getAccounts(): Account[] {
    return this.accounts;
  }

  getSummary(): ISummary {
    return {
      income: this.income,
      expenses: this.expenses,
      balance: this.balance,
    };
  }

  getSummaryString(): string {
    return `Всего счетов: ${this.accounts.length}, общий баланс: ${this.balance} ₽`;
  }

  toString(): string {
    const lines: string[] = [];
    lines.push(this.getSummaryString());

    if (this.accounts.length === 0) {
      lines.push("Счета отсутствуют.");
      return lines.join("\n");
    }

    lines.push("Список счетов:");
    for (const a of this.accounts) {
      lines.push(`- ${a.getSummaryString()}`);
    }

    return lines.join("\n");
  }
}
