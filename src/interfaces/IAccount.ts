import type { ITransaction } from "./ITransaction.js";
import type { ISummary } from "./ISummary.js";
import type { AccountUpdate } from "./utility-types.js";

export interface IAccount extends ISummary {
  id: string;
  name: string;

  update(update: AccountUpdate): void;

  addTransaction(transaction: ITransaction): void;
  removeTransactionById(transactionId: string): boolean;
  getTransactions(): ITransaction[];

  exportTransactionsToCSV(filename: string): Promise<void>;
}
