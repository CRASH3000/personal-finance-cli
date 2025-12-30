const income: number = 80000;   // общий доход за месяц
const expenses: number = 45000; // общий расход за месяц
const savings: number = 10000;  // сумма, которую вы хотите отложить

const netIncome: number = income - expenses;   // чистый доход
const remaining: number = netIncome - savings; // остаток после сбережений

console.log("income =", income);
console.log("expenses =", expenses);
console.log("savings =", savings);
console.log("netIncome =", netIncome);
console.log("remaining =", remaining);
