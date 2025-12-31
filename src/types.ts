// Тип для типа транзакции
export type TransactionType = "income" | "expense";

// Интерфейс транзакции
export interface ITransaction {
  id: number;
  amount: number;
  type: TransactionType;
  date: string; // ISO строка
  description: string;
}

// Интерфейс счёта
export interface IAccount {
  id: number;
  name: string;

  addTransaction(transaction: ITransaction): void;
  removeTransactionById(transactionId: number): boolean;
  getTransactions(): ITransaction[];
}

// Интерфейс сводки
export interface ISummary {
  income: number;
  expenses: number;
  balance: number;
}

// Интерфейс менеджера счетов
export interface IAccountManager {
  addAccount(account: IAccount): void;
  removeAccountById(accountId: number): boolean;
  getAccounts(): IAccount[];
  getAccountById(id: number): IAccount | undefined;
  getSummary(accountId: number): ISummary;
}
