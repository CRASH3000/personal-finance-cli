import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import type { ITransaction } from "../interfaces/ITransaction.js";
import type { TransactionType } from "../interfaces/TransactionType.js";
import type { TransactionUpdate } from "../interfaces/utility-types.js";
import { formatCurrency } from "formatCurrency";

export class Transaction implements ITransaction {
  public readonly id: string;

  public amount: number;
  public type: TransactionType;
  public date: string;
  public description: string;

  constructor(amount: number, type: TransactionType, date: string, description: string) {
    this.id = uuidv4();
    this.amount = amount;
    this.type = type;
    this.date = date;
    this.description = description;
  }

  update(update: TransactionUpdate): void {
    // id менять нельзя
    if (typeof update.id === "string" && update.id !== this.id) {
      return;
    }

    if (typeof update.amount === "number") this.amount = update.amount;
    if (update.type === "income" || update.type === "expense") this.type = update.type;
    if (typeof update.date === "string") this.date = update.date;
    if (typeof update.description === "string") this.description = update.description;
  }

  get prettyDate(): string {
    return moment(new Date(this.date)).format("LL");
  }

  toString(): string {
    const label: string = this.type === "income" ? "доход" : "расход";
    const money: string = formatCurrency(this.amount, "₽");
    return `Транзакция #${this.id}: ${this.description} (${label} ${money}) | ${this.prettyDate}`;
  }
}
