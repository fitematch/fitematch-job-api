export const MASKS_UTILS = 'MasksUtils';

export default class MasksUtils {
  static applyBrazilianSalaryMask(salary: string): string {
    if (!salary) {
      return 'R$ 0,00';
    }

    const rawSalary = salary.replace(/[^\d,.]/g, '');
    const lastCommaIndex = rawSalary.lastIndexOf(',');
    const lastDotIndex = rawSalary.lastIndexOf('.');
    const decimalSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex);

    const normalizedSalary =
      decimalSeparatorIndex >= 0
        ? `${rawSalary.slice(0, decimalSeparatorIndex).replace(/[.,]/g, '')}.${rawSalary
            .slice(decimalSeparatorIndex + 1)
            .replace(/[.,]/g, '')}`
        : rawSalary.replace(/[.,]/g, '');

    const parsedSalary = Number.parseFloat(normalizedSalary);

    if (Number.isNaN(parsedSalary)) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsedSalary);
  }
}
