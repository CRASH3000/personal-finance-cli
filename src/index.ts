import { Account } from "./classes/Account.js";
import { Transaction } from "./classes/Transaction.js";
import { AccountManager } from "./classes/AccountManager.js";

import { limits } from "./interfaces/utility-types.js";
import type {
  TransactionConstructorParams,
  TransactionInstance,
} from "./interfaces/utility-types.js";

const personalAccount = new Account("Личный бюджет");

const transaction = new Transaction(1000, "income", "2023-01-01T00:00:00Z", "Зарплата");

// update() транзакции
transaction.update({ amount: 1200 });
console.log("Обновлённая транзакция:");
console.log(transaction);

personalAccount.addTransaction(transaction);
personalAccount.addTransaction(new Transaction(200, "expense", "2023-01-05T00:00:00Z", "Продукты"));
personalAccount.addTransaction(new Transaction(150, "expense", "2023-01-09T00:00:00Z", "Коммунальные услуги"));

// update() аккаунта
personalAccount.update({ name: "Основной счёт" });
console.log("Обновлённый счёт:");
console.log(personalAccount);

const manager = new AccountManager();
manager.addAccount(personalAccount);

console.log(String(personalAccount));
console.log(`Общий баланс всех бюджетов: ${manager.balance} ₽`);

console.log("\nТранзакции основного счёта:");
personalAccount.getTransactions().forEach((t) => console.log(t.toString()));

console.log("Лимит пополнений:", limits.income);
console.log("Лимит трат:", limits.expense);

// ConstructorParameters + InstanceType
const transactionParams: TransactionConstructorParams = [
  500,
  "expense",
  "2023-02-01T00:00:00Z",
  "Покупка",
];

const newTransaction: TransactionInstance = new Transaction(...transactionParams);
console.log(newTransaction.toString());
