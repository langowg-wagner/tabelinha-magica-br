import { NutritionData } from '@/types/nutrition';
import { generateTableRows } from '@/utils/nutritionCalculations';
import { cn } from '@/lib/utils';

interface NutritionTableLinearProps {
  data: NutritionData;
  className?: string;
}

export function NutritionTableLinear({ data, className }: NutritionTableLinearProps) {
  const rows = generateTableRows(data);
  const unit = data.isLiquid ? 'ml' : 'g';

  // Build the linear text format per ANVISA (Figura 7)
  const buildLinearContent = () => {
    const parts: string[] = [];
    
    rows.forEach((row, index) => {
      // Format: Nutrient value unit (value unit, %VD%)
      const nutrientName = row.label.replace(/\s*\([^)]*\)\s*$/, ''); // Remove unit from label
      const unitMatch = row.label.match(/\(([^)]+)\)$/);
      const nutrientUnit = unitMatch ? unitMatch[1] : '';
      
      // Skip deeply indented items in the compact view or mark them differently
      const prefix = row.indentLevel && row.indentLevel > 0 ? 'dos quais ' : '';
      
      parts.push(
        `${prefix}${nutrientName} ${row.per100g} ${nutrientUnit} (${row.perPortion} ${nutrientUnit}, ${row.percentDV}%)`
      );
    });

    return parts;
  };

  const linearParts = buildLinearContent();

  return (
    <div className={cn('nutrition-table max-w-lg text-xs', className)}>
      {/* Header */}
      <div className="bg-foreground text-background font-bold text-sm py-2 px-3 text-center uppercase">
        Informação Nutricional
      </div>

      {/* Portion info */}
      <div className="px-3 py-2 text-xs border-b-2 border-table-border">
        Porções por embalagem: {data.portionsPerPackage || '000'} porções • Porção: {data.portionSize || '000'} {unit} {data.portionDescription}
      </div>

      {/* Separator line */}
      <div className="border-b-2 border-table-border"></div>

      {/* Linear content */}
      <div className="px-3 py-3 text-xs leading-relaxed">
        <span className="font-medium">Por 100 {unit} ({data.portionSize || '000'} {unit}, %VD*): </span>
        {linearParts.map((part, index) => (
          <span key={index}>
            {part}
            {index < linearParts.length - 1 && ' • '}
          </span>
        ))}
        .
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-[10px] text-muted-foreground border-t border-table-border">
        *Percentual de valores diários fornecidos pela porção.
      </div>
    </div>
  );
}
