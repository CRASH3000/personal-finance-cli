import { v4 as uuidv4 } from "uuid";
import type { IAccount } from "../interfaces/IAccount.js";
import type { ITransaction } from "../interfaces/ITransaction.js";
import type { ISummary } from "../interfaces/ISummary.js";
import { Transaction } from "./Transaction.js";
import { formatCurrency } from "formatCurrency";

export class Account implements IAccount, ISummary {
  public readonly id: string;

  public name: string;
  public transactions: Transaction[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  get income(): number {
    let sum: number = 0;
    for (const t of this.transactions) if (t.type === "income") sum += t.amount;
    return sum;
  }

  get expenses(): number {
    let sum: number = 0;
    for (const t of this.transactions) if (t.type === "expense") sum += t.amount;
    return sum;
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addTransaction(transaction: ITransaction): void {
    if (transaction instanceof Transaction) {
      this.transactions.push(transaction);
      return;
    }

    this.transactions.push(
      new Transaction(
        transaction.amount,
        transaction.type,
        transaction.date,
        transaction.description
      )
    );
  }

  removeTransactionById(transactionId: string): boolean {
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
    return `${this.name}: баланс ${formatCurrency(this.balance, "₽")}, транзакций ${this.transactions.length}`;
  }

  toString(): string {
    const lines: string[] = [];
    lines.push(`${this.name}`);
    lines.push(`Список транзакций:`);

    if (this.transactions.length === 0) {
      lines.push("— (пусто)");
      return lines.join("\n");
    }

    for (let i = 0; i < this.transactions.length; i++) {
      const t = this.transactions[i];
      lines.push(`${i + 1}) ${t.description} | ${t.type} ${formatCurrency(t.amount, "₽")} | ${t.prettyDate}`);
    }

    return lines.join("\n");
  }
}
