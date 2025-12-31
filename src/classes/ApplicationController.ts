import inquirer, { type Answers } from "inquirer";
import { AccountManager } from "./AccountManager.js";
import { Account } from "./Account.js";
import { Transaction } from "./Transaction.js";

type MainSelect = string | "__create__" | "__remove__" | "__exit__";
type AccountAction =
  | "__add_tx__"
  | "__remove_tx__"
  | "__export_csv__"
  | "__delete_account__"
  | "__back__";

export class ApplicationController {
  public accountManager: AccountManager = new AccountManager();
  private flash: string | null = null;
  private async safePrompt<T extends Answers>(questions: any): Promise<T> {
    const result = await inquirer.prompt(questions as any);
    return result as T;
  }

  private setFlash(message: string): void {
    this.flash = message;
  }

  private showFlash(): void {
    if (!this.flash) return;
    console.log(this.flash);
    console.log("");
    this.flash = null;
  }

  private line(char = "─", width = 60): string {
    return char.repeat(width);
  }

  private header(title: string, subtitle?: string): void {
    console.log(this.line("═"));
    console.log(`  ${title}`);
    if (subtitle) console.log(`  ${subtitle}`);
    console.log(this.line("═"));
    console.log("");
  }
  private hintMain(): string {
    return "Стрелки — выбор • Enter — подтвердить • Ctrl+C — выход";
  }

  private hintInputBack(): string {
    return "Enter без ввода → шаг назад • Вводишь значение → оно принимается";
  }
  private formatMoney(value: number): string {
    return `${value.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} ₽`;
  }

  private shortId(id: string): string {
    return id.slice(0, 6);
  }

  private toYmd(iso: string): string {
    return iso.slice(0, 10);
  }

  private truncate(text: string, max = 34): string {
    const t = text.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1)}…`;
  }

  private findAccount(accountId: string): Account | null {
    const accounts = this.accountManager.getAllAccounts() as Account[];
    return accounts.find((a) => a.id === accountId) ?? null;
  }

  private normalizeYmd(input: string): string {
    return input.trim().replace(/[./]/g, "-");
  }

  private isValidYmd(input: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return false;

    const [y, m, d] = input.split("-").map((x) => Number(x));
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;

    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }

  private async askInputBack(message: string, def?: string): Promise<string | null> {
    const res = await this.safePrompt<{ value: string }>([
      { type: "input", name: "value", message, default: def ?? undefined },
    ]);

    const raw = String(res.value ?? "");
    if (raw.trim().length === 0) return null; // пустой Enter => назад
    return raw;
  }

  public async start(): Promise<void> {
    while (true) {
      console.clear();
      this.header("Personal Finance CLI", this.hintMain());
      this.showFlash();

      const accounts: Account[] = this.accountManager.getAllAccounts() as Account[];
      const totalBalance =
        (this.accountManager as any).balance !== undefined
          ? (this.accountManager as any).balance
          : accounts.reduce((sum, a) => sum + a.balance, 0);

      console.log(`Счетов: ${accounts.length} • Общий баланс: ${this.formatMoney(totalBalance)}`);
      console.log("");

      const choices = [
        ...accounts.map((a) => ({
          name: `${a.name}  |  баланс: ${this.formatMoney(a.balance)}`,
          value: a.id,
        })),
        new inquirer.Separator(),
        { name: "➕ Создать счёт", value: "__create__" },
        { name: "🗑️  Удалить счёт", value: "__remove__" },
        { name: "🚪 Выход", value: "__exit__" },
      ];

      const answer = await this.safePrompt<{ selected: MainSelect }>([
        { type: "list", name: "selected", message: "Главное меню:", choices },
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

      await this.watchAccount(String(answer.selected));
    }
  }

  public async createAccount(): Promise<void> {
    while (true) {
      console.clear();
      this.header("Создание счёта", this.hintMain());
      console.log(this.hintInputBack());
      console.log("");
      this.showFlash();

      const name = await this.askInputBack("Название счёта:");
      if (name === null) return; // назад

      if (name.trim().length === 0) {
        this.setFlash("❌ Ошибка: название не может быть пустым.");
        continue;
      }

      const account = new Account(name.trim());
      this.accountManager.addAccount(account);

      this.setFlash(`✅ Счёт создан: "${account.name}"`);
      return;
    }
  }

  public async watchAccount(accountId: string): Promise<void> {
    while (true) {
      console.clear();

      const account = this.findAccount(accountId);
      if (!account) {
        this.setFlash("❌ Счёт не найден (возможно, удалён).");
        return;
      }

      this.header(`Счёт: ${account.name}`, `id: ${this.shortId(account.id)} • Ctrl+C — выход`);
      this.showFlash();

      console.log(
        `Баланс: ${this.formatMoney(account.balance)}  |  Доходы: ${this.formatMoney(
          account.income
        )}  |  Расходы: ${this.formatMoney(account.expenses)}`
      );
      console.log("");

      const txs = account.getTransactions() as Transaction[];
      console.log("Транзакции:");
      console.log(this.line("─"));

      if (txs.length === 0) {
        console.log("— (пусто)");
      } else {
        for (let i = 0; i < txs.length; i++) {
          const t = txs[i];
          const typeLabel = t.type === "income" ? "Доход " : "Расход";
          const row =
            `${String(i + 1).padStart(2, " ")}.` +
            ` [${this.shortId(t.id)}] ` +
            `${typeLabel.padEnd(6, " ")}` +
            ` ${this.formatMoney(t.amount).padStart(10, " ")}` +
            `  ${this.toYmd(t.date)}  ` +
            `${this.truncate(t.description, 40)}`;

          console.log(row);
        }
      }

      console.log(this.line("─"));
      console.log("");

      const action = await this.safePrompt<{ action: AccountAction }>([
        {
          type: "list",
          name: "action",
          message: "Действия:",
          choices: [
            { name: "➕ Добавить транзакцию", value: "__add_tx__" },
            { name: "🗑️  Удалить транзакцию", value: "__remove_tx__" },
            { name: "📄 Экспортировать в CSV", value: "__export_csv__" },
            new inquirer.Separator(),
            { name: "🧨 Удалить счёт", value: "__delete_account__" },
            { name: "⬅️ Назад", value: "__back__" },
          ],
        },
      ]);

      if (action.action === "__back__") return;

      if (action.action === "__add_tx__") {
        await this.addTransaction(accountId);
        continue;
      }

      if (action.action === "__remove_tx__") {
        await this.removeTransaction(accountId);
        continue;
      }

      if (action.action === "__export_csv__") {
        await this.exportTransactionsToCSV(accountId);
        continue;
      }

      if (action.action === "__delete_account__") {
        const ok = await this.safePrompt<{ ok: boolean }>([
          { type: "confirm", name: "ok", message: "Точно удалить счёт?", default: false },
        ]);

        if (!ok.ok) continue;

        const removed =
          (this.accountManager as any).removeAccountById?.(accountId) ??
          (this.accountManager as any).removeById?.(accountId);

        if (!removed) {
          this.setFlash("❌ Не удалось удалить счёт (метод удаления не найден или счёт не найден).");
          continue;
        }

        this.setFlash("✅ Счёт удалён.");
        return;
      }
    }
  }

  public async removeAccount(): Promise<void> {
    console.clear();
    this.header("Удаление счёта", this.hintMain());
    this.showFlash();

    const accounts: Account[] = this.accountManager.getAllAccounts() as Account[];
    if (accounts.length === 0) {
      this.setFlash("ℹ️ Счетов нет.");
      return;
    }

    const picked = await this.safePrompt<{ accountId: string }>([
      {
        type: "list",
        name: "accountId",
        message: "Какой счёт удалить?",
        choices: [
          { name: "⬅️ Назад", value: "__back__" as any },
          new inquirer.Separator(),
          ...accounts.map((a) => ({
            name: `${a.name}  |  баланс: ${this.formatMoney(a.balance)}`,
            value: a.id,
          })),
        ],
      },
    ]);

    if ((picked as any).accountId === "__back__") return;

    const confirmed = await this.safePrompt<{ ok: boolean }>([
      { type: "confirm", name: "ok", message: "Подтвердить удаление?", default: false },
    ]);

    if (!confirmed.ok) {
      this.setFlash("ℹ️ Удаление отменено.");
      return;
    }

    const removed =
      (this.accountManager as any).removeAccountById?.(picked.accountId) ??
      (this.accountManager as any).removeById?.(picked.accountId);

    if (!removed) {
      this.setFlash("❌ Не удалось удалить счёт (метод удаления не найден или счёт не найден).");
      return;
    }

    this.setFlash("✅ Счёт удалён.");
  }

  public async addTransaction(accountId: string): Promise<void> {
    const account = this.findAccount(accountId);
    if (!account) return;

    // amount
    let amount = 0;
    while (true) {
      console.clear();
      this.header("Добавление транзакции", this.hintMain());
      console.log(this.hintInputBack());
      console.log("");
      this.showFlash();

      const raw = await this.askInputBack("Сумма (больше 0):");
      if (raw === null) return;

      const num = Number(raw.replace(",", "."));
      if (Number.isFinite(num) && num > 0) {
        amount = num;
        break;
      }

      this.setFlash("❌ Ошибка: сумма должна быть числом больше 0.");
    }

    // type
    const typeRes = await this.safePrompt<{ type: "income" | "expense" }>([
      {
        type: "list",
        name: "type",
        message: "Тип:",
        choices: [
          { name: "Доход", value: "income" },
          { name: "Расход", value: "expense" },
        ],
      },
    ]);

    // date
    const today = new Date().toISOString().slice(0, 10);
    let ymd = today;

    while (true) {
      console.clear();
      this.header("Добавление транзакции", this.hintMain());
      console.log(this.hintInputBack());
      console.log("");
      this.showFlash();

      const raw = await this.askInputBack("Дата (YYYY-MM-DD):", today);
      if (raw === null) return;

      const norm = this.normalizeYmd(raw);
      if (this.isValidYmd(norm)) {
        ymd = norm;
        break;
      }

      this.setFlash("❌ Ошибка: дата должна быть YYYY-MM-DD (можно 2025.12.31 или 2025/12/31).");
    }

    // description
    let description = "";
    while (true) {
      console.clear();
      this.header("Добавление транзакции", this.hintMain());
      console.log(this.hintInputBack());
      console.log("");
      this.showFlash();

      const raw = await this.askInputBack("Описание:");
      if (raw === null) return;

      if (raw.trim().length > 0) {
        description = raw.trim();
        break;
      }

      this.setFlash("❌ Ошибка: описание не может быть пустым.");
    }

    const isoDate = `${ymd}T00:00:00Z`;
    account.addTransaction(new Transaction(amount, typeRes.type, isoDate, description));

    this.setFlash("✅ Транзакция добавлена.");
  }

  public async removeTransaction(accountId: string): Promise<void> {
    console.clear();

    const account = this.findAccount(accountId);
    if (!account) return;

    const txs = account.getTransactions() as Transaction[];
    if (txs.length === 0) {
      this.setFlash("ℹ️ Транзакций нет.");
      return;
    }

    const picked = await this.safePrompt<{ txId: string }>([
      {
        type: "list",
        name: "txId",
        message: "Какую транзакцию удалить?",
        choices: [
          { name: "⬅️ Назад", value: "__back__" as any },
          new inquirer.Separator(),
          ...txs.map((t) => ({
            name: `[${this.shortId(t.id)}] ${t.type === "income" ? "Доход" : "Расход"} ${this.formatMoney(
              t.amount
            )} | ${this.toYmd(t.date)} | ${this.truncate(t.description, 40)}`,
            value: t.id,
          })),
        ],
      },
    ]);

    if ((picked as any).txId === "__back__") return;

    const confirmed = await this.safePrompt<{ ok: boolean }>([
      { type: "confirm", name: "ok", message: "Точно удалить транзакцию?", default: false },
    ]);

    if (!confirmed.ok) {
      this.setFlash("ℹ️ Удаление отменено.");
      return;
    }

    const ok = account.removeTransactionById(picked.txId);
    this.setFlash(ok ? "✅ Транзакция удалена." : "❌ Не удалось удалить транзакцию.");
  }

  public async exportTransactionsToCSV(accountId: string): Promise<void> {
    const account = this.findAccount(accountId);
    if (!account) return;

    const suggested = account.name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\wа-яА-Я_-]/g, "")
      .toLowerCase();

    while (true) {
      console.clear();
      this.header("Экспорт в CSV", this.hintMain());
      console.log(this.hintInputBack());
      console.log("");
      this.showFlash();

      const file = await this.askInputBack("Имя файла (без .csv):", suggested || "account");
      if (file === null) return;

      if (file.trim().length === 0) {
        this.setFlash("❌ Ошибка: имя файла не может быть пустым.");
        continue;
      }

      const base = file.trim();
      const filename = base.toLowerCase().endsWith(".csv") ? base : `${base}.csv`;

      try {
        await account.exportTransactionsToCSV(filename);
        this.setFlash(`✅ CSV файл создан: ${filename}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        this.setFlash(`❌ Ошибка экспорта: ${msg}`);
      }

      return;
    }
  }
}