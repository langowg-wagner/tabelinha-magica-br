// Allergen types per RDC 727/2022
export const ALLERGENS = [
  { id: 'wheat', label: 'Trigo' },
  { id: 'rye', label: 'Centeio' },
  { id: 'barley', label: 'Cevada' },
  { id: 'oats', label: 'Aveia' },
  { id: 'crustaceans', label: 'Crustáceos' },
  { id: 'eggs', label: 'Ovos' },
  { id: 'fish', label: 'Peixes' },
  { id: 'peanuts', label: 'Amendoim' },
  { id: 'soy', label: 'Soja' },
  { id: 'milk', label: 'Leite' },
  { id: 'almonds', label: 'Amêndoa' },
  { id: 'hazelnuts', label: 'Avelãs' },
  { id: 'cashews', label: 'Castanha-de-caju' },
  { id: 'brazilNuts', label: 'Castanha-do-brasil' },
  { id: 'macadamias', label: 'Macadâmias' },
  { id: 'walnuts', label: 'Nozes' },
  { id: 'pecans', label: 'Pecãs' },
  { id: 'pistachios', label: 'Pistaches' },
  { id: 'pineNuts', label: 'Pinoli' },
  { id: 'chestnuts', label: 'Castanhas' },
  { id: 'latex', label: 'Látex natural' },
] as const;

export type AllergenId = typeof ALLERGENS[number]['id'];

export interface AllergenData {
  contains: AllergenId[];        // "CONTÉM"
  containsDerivatives: AllergenId[];  // "CONTÉM DERIVADOS DE"
  mayContain: AllergenId[];      // "PODE CONTER" (cross-contamination)
}

export type GlutenStatus = 'contains' | 'free';
export type LactoseStatus = 'contains' | 'none';

export interface NutritionData {
  productName: string;
  portionsPerPackage: number;
  portionSize: number;
  portionDescription: string;
  isLiquid: boolean;
  
  // Per 100g values
  energyKcal100g: number;
  carbohydrates100g: number;
  totalSugars100g: number;
  addedSugars100g: number;
  proteins100g: number;
  totalFats100g: number;
  saturatedFats100g: number;
  transFats100g: number;
  dietaryFiber100g: number;
  sodium100g: number;
  
  // Optional vitamins and minerals
  vitaminA100g?: number;
  vitaminC100g?: number;
  vitaminD100g?: number;
  vitaminE100g?: number;
  calcium100g?: number;
  iron100g?: number;
  potassium100g?: number;
  zinc100g?: number;

  // Allergens, gluten, lactose - RDC 727/2022
  allergens: AllergenData;
  glutenStatus: GlutenStatus;
  lactoseStatus: LactoseStatus;
}

export interface NutritionTableRow {
  label: string;
  per100g: string;
  perPortion: string;
  percentDV: string;
  /**
   * Visual indentation level for sub-items (e.g., sugars under carbohydrates).
   * 0 = no indent
   */
  indentLevel?: number;
}

export interface FrontWarnings {
  highAddedSugar: boolean;
  highSaturatedFat: boolean;
  highSodium: boolean;
}

// Daily Reference Values (Brazil - ANVISA RDC 429/2020)
export const DAILY_VALUES = {
  energyKcal: 2000,
  carbohydrates: 300,
  totalSugars: 50,
  addedSugars: 50,
  proteins: 75,
  totalFats: 55, // Corrected from 65g
  saturatedFats: 22,
  transFats: 2,
  dietaryFiber: 25,
  sodium: 2400,
  // Vitamins
  vitaminA: 600, // μg
  vitaminC: 45, // mg
  vitaminD: 5, // μg
  vitaminE: 10, // mg
  // Minerals
  calcium: 1000, // mg
  iron: 14, // mg
  potassium: 3500, // mg
  zinc: 7, // mg (corrected - 130μg seems wrong in source)
};

// Thresholds for front-of-pack warnings (ANVISA)
export const WARNING_THRESHOLDS = {
  solid: {
    addedSugar: 15, // g per 100g
    saturatedFat: 6, // g per 100g
    sodium: 600, // mg per 100g
  },
  liquid: {
    addedSugar: 7.5, // g per 100ml
    saturatedFat: 3, // g per 100ml
    sodium: 300, // mg per 100ml
  },
};

export const DEFAULT_NUTRITION_DATA: NutritionData = {
  productName: '',
  portionsPerPackage: 1,
  portionSize: 100,
  portionDescription: '(medida caseira)',
  isLiquid: false,
  energyKcal100g: 0,
  carbohydrates100g: 0,
  totalSugars100g: 0,
  addedSugars100g: 0,
  proteins100g: 0,
  totalFats100g: 0,
  saturatedFats100g: 0,
  transFats100g: 0,
  dietaryFiber100g: 0,
  sodium100g: 0,
  allergens: {
    contains: [],
    containsDerivatives: [],
    mayContain: [],
  },
  glutenStatus: 'free',
  lactoseStatus: 'none',
};
