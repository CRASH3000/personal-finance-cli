import inquirer from "inquirer";
import { AccountManager } from "./AccountManager.js";
import { Account } from "./Account.js";

type MainMenuAction = "open" | "create" | "remove" | "exit";

export class ApplicationController {
  public accountManager: AccountManager = new AccountManager();

  public async start(): Promise<void> {
    while (true) {
      console.clear();

      const accounts: Account[] = this.accountManager.getAllAccounts() as Account[];

      const choices = [
        ...accounts.map((a) => ({
          name: `${a.name} — ${a.balance} ₽`,
          value: a.id,
        })),
        new inquirer.Separator(),
        { name: "➕ Создать счёт", value: "__create__" },
        { name: "🗑️ Удалить счёт", value: "__remove__" },
        { name: "🚪 Выход", value: "__exit__" },
      ];

      const answer = await inquirer.prompt<{ selected: string }>([
        {
          type: "list",
          name: "selected",
          message: "Счета:",
          choices,
        },
      ]);

      if (answer.selected === "__exit__") return;

      if (answer.selected === "__create__") {
        await this.createAccount();
        continue;
      }

      if (answer.selected === "__remove__") {
        await this.removeAccount();
        continue;
      }

      await this.watchAccount(answer.selected);
    }
  }

  public async createAccount(): Promise<void> {
    console.clear();

    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: "input",
        name: "name",
        message: "Название нового счёта:",
        validate: (value: string) => (value.trim().length > 0 ? true : "Название не может быть пустым"),
      },
    ]);

    const account = new Account(name.trim());
    this.accountManager.addAccount(account);
  }

  public async watchAccount(_accountId: string): Promise<void> {
    console.clear();
    console.log("Просмотр счёта пока не реализован.");
    await inquirer.prompt([{ type: "input", name: "x", message: "Нажми Enter чтобы вернуться" }]);
  }

  public async removeAccount(): Promise<void> {
    console.clear();

    const accounts: Account[] = this.accountManager.getAllAccounts() as Account[];
    if (accounts.length === 0) {
      console.log("Счетов нет.");
      await inquirer.prompt([{ type: "input", name: "x", message: "Нажми Enter" }]);
      return;
    }

    const { accountId } = await inquirer.prompt<{ accountId: string }>([
      {
        type: "list",
        name: "accountId",
        message: "Какой счёт удалить?",
        choices: accounts.map((a) => ({ name: `${a.name} — ${a.balance} ₽`, value: a.id })),
      },
    ]);

    const { ok } = await inquirer.prompt<{ ok: boolean }>([
      { type: "confirm", name: "ok", message: "Точно удалить счёт?", default: false },
    ]);

    if (!ok) return;

    const removed = (this.accountManager as any).removeAccountById?.(accountId)
      ?? (this.accountManager as any).removeById?.(accountId);

    if (!removed) {
      console.log("Не удалось удалить счёт (метод удаления не найден или счёт не найден).");
      await inquirer.prompt([{ type: "input", name: "x", message: "Нажми Enter" }]);
    }
  }

  public async addTransaction(_accountId: string): Promise<void> {}
  public async removeTransaction(_accountId: string): Promise<void> {}
  public async exportTransactionsToCSV(_accountId: string): Promise<void> {}
}
