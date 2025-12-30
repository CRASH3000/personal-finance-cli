// calculateTotal: сумма значений массива
function calculateTotal(values: number[]): number {
  let total: number = 0;

  for (const v of values) {
    total = total + v;
  }

  return total;
}

// calculateAverage: среднее (если массив пустой — 0)
function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total: number = calculateTotal(values);
  return total / values.length;
}

// formatCurrency: формат "1000 ₽"
function formatCurrency(amount: number, symbol: string): string {
  return `${amount} ${symbol}`;
}

// getTopValues: N наибольших значений (по убыванию)
function getTopValues(values: number[], count: number): number[] {
  const sorted: number[] = [...values].sort((a, b) => b - a);
  return sorted.slice(0, count);
}

// printSummary: печать количества, суммы и среднего
function printSummary(values: number[]): void {
  const totalCount: number = values.length;
  const total: number = calculateTotal(values);
  const average: number = calculateAverage(values);

  console.log(`Всего записей: ${totalCount}`);
  console.log(`Сумма: ${total}`);
  console.log(`Среднее: ${average}`);
}

// Проверка решения вызов каждой функции
const sampleValues: number[] = [100, 500, 1000, 2000, 800];

const totalResult: number = calculateTotal(sampleValues);
console.log("calculateTotal =", totalResult);

const averageResult: number = calculateAverage(sampleValues);
console.log("calculateAverage =", averageResult);

const formatted: string = formatCurrency(1000, "₽");
console.log("formatCurrency =", formatted);

const topValues: number[] = getTopValues([100, 500, 200, 800], 2);
console.log("getTopValues =", topValues);

printSummary(sampleValues);
