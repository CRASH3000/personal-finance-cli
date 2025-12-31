import { ApplicationController } from "./classes/ApplicationController.js";
import { Account } from "./classes/Account.js";
import { Transaction } from "./classes/Transaction.js";

async function main(): Promise<void> {
  const controller = new ApplicationController();

  // initial state
  const personalAccount = new Account("Личный бюджет");
  personalAccount.addTransaction(new Transaction(1000, "income", "2023-01-01", "Зарплата"));
  personalAccount.addTransaction(new Transaction(200, "expense", "2023-01-05", "Продукты"));
  controller.accountManager.addAccount(personalAccount);

  await controller.start(); // ВАЖНО: один раз и с await
}

main().catch((e) => console.error(e));
