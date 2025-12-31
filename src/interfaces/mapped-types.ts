import type { ITransaction } from "./ITransaction.js";

// TransactionFieldType<TField>
export type TransactionFieldType<TField> =
  TField extends keyof ITransaction ? ITransaction[TField] : never;

// OptionalTransaction<TFields>
export type OptionalTransaction<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> & Partial<Pick<ITransaction, TFields>>;

// ReadonlyTransactionFields<TFields>
export type ReadonlyTransactionFields<TFields extends keyof ITransaction> =
  Omit<ITransaction, TFields> & Readonly<Pick<ITransaction, TFields>>;

// IsIncome<T>
export type IsIncome<T> = T extends { type: "income" } ? true : false;

// Примеры использования 
type AmountType = TransactionFieldType<"amount">; // number
type UnknownType = TransactionFieldType<"unknown">; // never

type TransactionWithOptionalDescAndDate = OptionalTransaction<"description" | "date">;
type TransactionReadonlyIdAndType = ReadonlyTransactionFields<"id" | "type">;

type CheckIncome1 = IsIncome<{ type: "income"; amount: number }>; // true
type CheckIncome2 = IsIncome<{ type: "expense"; amount: number }>; // false
type CheckIncome3 = IsIncome<ITransaction>; // false (type: income | expense)
