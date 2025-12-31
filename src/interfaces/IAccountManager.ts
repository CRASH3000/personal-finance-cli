namespace BudgetTracker {
  export interface IAccountManager {
    addAccount(account: IAccount): void;
    removeAccountById(accountId: number): boolean;
    getAccountById(id: number): IAccount | undefined;
    getAllAccounts(): IAccount[];
  }
}
