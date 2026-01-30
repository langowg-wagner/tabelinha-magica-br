import { NutritionData } from '@/types/nutrition';
import { generateTableRows } from '@/utils/nutritionCalculations';
import { cn } from '@/lib/utils';

interface NutritionTableProps {
  data: NutritionData;
  className?: string;
}

export function NutritionTable({ data, className }: NutritionTableProps) {
  const rows = generateTableRows(data);
  const unit = data.isLiquid ? 'ml' : 'g';

  return (
    <div className={cn('nutrition-table max-w-md', className)}>
      {/* Header */}
      <div className="nutrition-table-header">
        Informação Nutricional
      </div>

      {/* Portion info */}
      <div className="px-3 py-2 text-sm border-b-2 border-table-border">
        <div>Porções por embalagem: {data.portionsPerPackage || '000'}</div>
        <div>Porção: {data.portionSize || '000'} {unit} {data.portionDescription}</div>
      </div>

      {/* Column headers */}
      <div className="nutrition-table-row grid grid-cols-[1fr_70px_70px_60px] border-b-2 border-table-border bg-table-header-bg">
        <div className="nutrition-table-cell"></div>
        <div className="nutrition-table-cell nutrition-table-cell-value font-medium">100 {unit}</div>
        <div className="nutrition-table-cell nutrition-table-cell-value font-medium">{data.portionSize || '000'} {unit}</div>
        <div className="nutrition-table-cell nutrition-table-cell-value font-medium">%VD*</div>
      </div>

      {/* Data rows */}
      {rows.map((row, index) => (
        <div 
          key={index} 
          className="nutrition-table-row grid grid-cols-[1fr_70px_70px_60px]"
        >
        <div className="nutrition-table-cell nutrition-table-cell-header">
          {row.label}
        </div>
          <div className="nutrition-table-cell nutrition-table-cell-value">{row.per100g}</div>
          <div className="nutrition-table-cell nutrition-table-cell-value">{row.perPortion}</div>
          <div className="nutrition-table-cell nutrition-table-cell-value">{row.percentDV}</div>
        </div>
      ))}

      {/* Footer */}
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-table-border">
        *Percentual de valores diários fornecidos pela porção.
      </div>
    </div>
  );
}
