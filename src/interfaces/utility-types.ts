import type { ITransaction } from "./ITransaction.js";
import type { IAccount } from "./IAccount.js";
import type { TransactionType } from "./TransactionType.js";
import { Transaction } from "../classes/Transaction.js";

// Partial для апдейтов
export type TransactionUpdate = Partial<ITransaction>;
export type AccountUpdate = Partial<IAccount>;

// Required + Omit
export type CompleteTransaction = Required<ITransaction>;
export type TransactionWithoutDescription = Omit<ITransaction, "description">;

// Pick
export type TransactionPreview = Pick<ITransaction, "id" | "amount" | "type" | "date">;
export type AccountInfo = Pick<IAccount, "id" | "name">;

// Record лимитов
export type CategoryLimits = Record<TransactionType, number>;

export const limits: CategoryLimits = {
  income: 10000,
  expense: 5000,
};

// Параметры конструктора + инстанс
export type TransactionConstructorParams = ConstructorParameters<typeof Transaction>;
export type TransactionInstance = InstanceType<typeof Transaction>;

// nullable описание
export type NullableDescription = Omit<ITransaction, "description"> & {
  description: string | null;
};
