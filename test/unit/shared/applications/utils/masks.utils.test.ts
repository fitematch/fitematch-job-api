import MasksUtils from '@src/shared/applications/utils/masks.utils';

describe('MasksUtils', () => {
  describe('applyBrazilianSalaryMask', () => {
    it('should return zero currency when salary is empty', () => {
      expect(MasksUtils.applyBrazilianSalaryMask('')).toBe('R$ 0,00');
    });

    it('should return zero currency when salary is invalid', () => {
      expect(MasksUtils.applyBrazilianSalaryMask('abc')).toBe('R$ 0,00');
    });

    it('should format integer salary values', () => {
      expect(MasksUtils.applyBrazilianSalaryMask('2500')).toBe(
        'R$\u00A02.500,00',
      );
    });

    it('should normalize decimal values using comma separators', () => {
      expect(MasksUtils.applyBrazilianSalaryMask('2.500,50')).toBe(
        'R$\u00A02.500,50',
      );
    });

    it('should normalize decimal values using dot separators', () => {
      expect(MasksUtils.applyBrazilianSalaryMask('2500.5')).toBe(
        'R$\u00A02.500,50',
      );
    });
  });
});
