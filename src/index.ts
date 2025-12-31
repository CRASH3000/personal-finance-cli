import { ApplicationController } from "./classes/ApplicationController.js";
import { Account } from "./classes/Account.js";
import { Transaction } from "./classes/Transaction.js";

const controller = new ApplicationController();
setInitialState(controller);

await controller.start();

function setInitialState(controller: ApplicationController): void {
  const personalAccount = new Account("Личный бюджет");
  personalAccount.addTransaction(new Transaction(1000, "income", "2023-01-01T00:00:00Z", "Зарплата"));
  personalAccount.addTransaction(new Transaction(200, "expense", "2023-01-05T00:00:00Z", "Продукты"));
  personalAccount.addTransaction(new Transaction(150, "expense", "2023-01-09T00:00:00Z", "Коммунальные услуги"));
  controller.accountManager.addAccount(personalAccount);

  const vacationAccount = new Account("Копилка на отпуск");
  vacationAccount.addTransaction(new Transaction(500, "income", "2023-04-01T00:00:00Z", "Премия"));
  vacationAccount.addTransaction(new Transaction(600, "income", "2023-01-01T00:00:00Z", "Возврат долга"));
  vacationAccount.addTransaction(new Transaction(300, "expense", "2023-01-05T00:00:00Z", "Билеты на самолёт"));
  vacationAccount.addTransaction(new Transaction(200, "expense", "2023-01-09T00:00:00Z", "Номер в отеле"));
  controller.accountManager.addAccount(vacationAccount);
}
