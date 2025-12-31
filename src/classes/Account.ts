import { v4 as uuidv4 } from "uuid";
import type { IAccount } from "../interfaces/IAccount.js";
import type { ITransaction } from "../interfaces/ITransaction.js";
import type { ISummary } from "../interfaces/ISummary.js";
import type { AccountUpdate } from "../interfaces/utility-types.js";
import { Transaction } from "./Transaction.js";
import { formatCurrency } from "formatCurrency";
import { writeFile } from "fs/promises";
import { escapeCsvValue } from "../utils/escapeCsvValue.js";

export class Account implements IAccount, ISummary {
  public id: string;
  public name: string;
  public transactions: Transaction[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  update(update: AccountUpdate): void {
    // id менять нельзя
    if (typeof update.id === "string" && update.id !== this.id) {
      return;
    }

    if (typeof update.name === "string") {
      this.name = update.name;
    }
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

  // упрощённая строка (по требованиям ДЗ-13)
  getSummaryString(): string {
    return `${this.name}: баланс ${formatCurrency(this.balance, "₽")}`;
  }

  async exportTransactionsToCSV(filename: string): Promise<void> {
    const header: string = "id,amount,type,date,description";

    const rows: string[] = this.transactions.map((t) => {
      const cols: (string | number)[] = [t.id, t.amount, t.type, t.date, t.description];
      return cols.map(escapeCsvValue).join(",");
    });

    const csv: string = [header, ...rows].join("\n");

    try {
      await writeFile(filename, csv, { encoding: "utf-8" });
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : String(error);
      throw new Error(`Не удалось записать CSV в файл "${filename}": ${message}`);
    }
  }

  // можно упростить (id обрезаем)
  toString(): string {
    const lines: string[] = [];
    lines.push(this.getSummaryString());

    if (this.transactions.length === 0) {
      lines.push("Транзакции: — (пусто)");
      return lines.join("\n");
    }

    lines.push("Транзакции:");
    for (let i = 0; i < this.transactions.length; i++) {
      const t = this.transactions[i];
      const shortId: string = t.id.slice(0, 8);
      lines.push(
        `${i + 1}) #${shortId} ${t.description} | ${t.type} ${formatCurrency(t.amount, "₽")} | ${t.prettyDate}`
      );
    }

    return lines.join("\n");
  }
}
