import { NutritionData, DAILY_VALUES, NutritionTableRow, FrontWarnings, WARNING_THRESHOLDS } from '@/types/nutrition';

export function calculatePerPortion(value100g: number, portionSize: number): number {
  return (value100g * portionSize) / 100;
}

export function calculatePercentDV(value: number, dailyValue: number): number {
  if (dailyValue === 0) return 0;
  return Math.round((value / dailyValue) * 100);
}

export function formatNumber(value: number, decimals: number = 1): string {
  if (value === 0) return '0';
  return value.toFixed(decimals).replace('.', ',');
}

export function formatPercentDV(percent: number): string {
  if (percent === 0) return '0';
  return `${percent}`;
}

export function generateTableRows(data: NutritionData): NutritionTableRow[] {
  const { portionSize } = data;

  const createRow = (
    label: string,
    value100g: number,
    unit: string,
    dailyValue: number,
    indentLevel: number = 0
  ): NutritionTableRow => {
    const perPortion = calculatePerPortion(value100g, portionSize);
    const percentDV = calculatePercentDV(perPortion, dailyValue);

    return {
      label: `${label} (${unit})`,
      per100g: formatNumber(value100g),
      perPortion: formatNumber(perPortion),
      percentDV: formatPercentDV(percentDV),
      indentLevel,
    };
  };

  const rows: NutritionTableRow[] = [
    createRow('Valor energético', data.energyKcal100g, 'kcal', DAILY_VALUES.energyKcal),
    createRow('Carboidratos', data.carbohydrates100g, 'g', DAILY_VALUES.carbohydrates),
    createRow('Açúcares totais', data.totalSugars100g, 'g', DAILY_VALUES.totalSugars, 1),
    createRow('Açúcares adicionados', data.addedSugars100g, 'g', DAILY_VALUES.addedSugars, 2),
    createRow('Proteínas', data.proteins100g, 'g', DAILY_VALUES.proteins),
    createRow('Gorduras totais', data.totalFats100g, 'g', DAILY_VALUES.totalFats),
    createRow('Gorduras saturadas', data.saturatedFats100g, 'g', DAILY_VALUES.saturatedFats, 1),
    createRow('Gorduras trans', data.transFats100g, 'g', DAILY_VALUES.transFats, 1),
    createRow('Fibras alimentares', data.dietaryFiber100g, 'g', DAILY_VALUES.dietaryFiber),
    createRow('Sódio', data.sodium100g, 'mg', DAILY_VALUES.sodium),
  ];

  // Add optional vitamins and minerals if present
  if (data.vitaminA100g && data.vitaminA100g > 0) {
    rows.push(createRow('Vitamina A', data.vitaminA100g, 'μg', DAILY_VALUES.vitaminA));
  }
  if (data.vitaminC100g && data.vitaminC100g > 0) {
    rows.push(createRow('Vitamina C', data.vitaminC100g, 'mg', DAILY_VALUES.vitaminC));
  }
  if (data.vitaminD100g && data.vitaminD100g > 0) {
    rows.push(createRow('Vitamina D', data.vitaminD100g, 'μg', DAILY_VALUES.vitaminD));
  }
  if (data.vitaminE100g && data.vitaminE100g > 0) {
    rows.push(createRow('Vitamina E', data.vitaminE100g, 'mg', DAILY_VALUES.vitaminE));
  }
  if (data.calcium100g && data.calcium100g > 0) {
    rows.push(createRow('Cálcio', data.calcium100g, 'mg', DAILY_VALUES.calcium));
  }
  if (data.iron100g && data.iron100g > 0) {
    rows.push(createRow('Ferro', data.iron100g, 'mg', DAILY_VALUES.iron));
  }
  if (data.potassium100g && data.potassium100g > 0) {
    rows.push(createRow('Potássio', data.potassium100g, 'mg', DAILY_VALUES.potassium));
  }
  if (data.zinc100g && data.zinc100g > 0) {
    rows.push(createRow('Zinco', data.zinc100g, 'mg', DAILY_VALUES.zinc));
  }

  return rows;
}

export function calculateFrontWarnings(data: NutritionData): FrontWarnings {
  const thresholds = data.isLiquid ? WARNING_THRESHOLDS.liquid : WARNING_THRESHOLDS.solid;

  return {
    highAddedSugar: data.addedSugars100g >= thresholds.addedSugar,
    highSaturatedFat: data.saturatedFats100g >= thresholds.saturatedFat,
    highSodium: data.sodium100g >= thresholds.sodium,
  };
}

export function hasAnyWarning(warnings: FrontWarnings): boolean {
  return warnings.highAddedSugar || warnings.highSaturatedFat || warnings.highSodium;
}
