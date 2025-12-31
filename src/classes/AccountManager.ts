import type { IAccountManager } from "../interfaces/IAccountManager.js";
import type { ISummary } from "../interfaces/ISummary.js";
import { Account } from "./Account.js";

export class AccountManager implements IAccountManager, ISummary {
  public accounts: Account[] = [];

  get income(): number {
    let sum: number = 0;
    for (const a of this.accounts) sum += a.income;
    return sum;
  }

  get expenses(): number {
    let sum: number = 0;
    for (const a of this.accounts) sum += a.expenses;
    return sum;
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addAccount(account: Account): void {
    this.accounts.push(account);
  }

  removeAccountById(accountId: string): boolean {
    const index: number = this.accounts.findIndex((a) => a.id === accountId);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    return true;
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find((a) => a.id === id);
  }

  getAllAccounts(): Account[] {
    return this.accounts;
  }

  getSummary(): ISummary {
    return { income: this.income, expenses: this.expenses, balance: this.balance };
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
