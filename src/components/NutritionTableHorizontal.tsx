import { NutritionData } from '@/types/nutrition';
import { generateTableRows } from '@/utils/nutritionCalculations';
import { cn } from '@/lib/utils';

interface NutritionTableHorizontalProps {
  data: NutritionData;
  className?: string;
}

export function NutritionTableHorizontal({ data, className }: NutritionTableHorizontalProps) {
  const rows = generateTableRows(data);
  const unit = data.isLiquid ? 'ml' : 'g';

  return (
    <div className={cn('nutrition-table max-w-2xl', className)}>
      {/* Table structure mimicking ANVISA horizontal format */}
      <div className="flex">
        {/* Left side - Title and portion info */}
        <div className="border-r-2 border-table-border flex flex-col">
          <div className="bg-foreground text-background font-bold text-sm py-2 px-3 text-center">
            INFORMAÇÃO<br />NUTRICIONAL
          </div>
          <div className="px-3 py-2 text-xs flex-1 flex flex-col justify-center">
            <div>Porções por emb.:</div>
            <div className="font-medium">{data.portionsPerPackage || '000'}</div>
            <div className="mt-1">Porção: {data.portionSize || '000'} {unit}</div>
            <div>{data.portionDescription}</div>
          </div>
        </div>

        {/* Right side - Nutrients table */}
        <div className="flex-1">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_60px_60px_50px] bg-foreground text-background">
            <div className="px-2 py-1.5 text-xs font-bold border-r border-background/30"></div>
            <div className="px-2 py-1.5 text-xs font-bold text-center border-r border-background/30">100 {unit}</div>
            <div className="px-2 py-1.5 text-xs font-bold text-center border-r border-background/30">{data.portionSize || '000'} {unit}</div>
            <div className="px-2 py-1.5 text-xs font-bold text-center">%VD*</div>
          </div>

          {/* Data rows */}
          {rows.map((row, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[1fr_60px_60px_50px] border-b border-table-border"
            >
              <div className="px-2 py-1 text-xs border-r border-table-border">
                <span
                  className={cn(
                    'block',
                    row.indentLevel === 1 && 'ml-2',
                    row.indentLevel === 2 && 'ml-4'
                  )}
                >
                  {row.label}
                </span>
              </div>
              <div className="px-2 py-1 text-xs text-center border-r border-table-border">{row.per100g}</div>
              <div className="px-2 py-1 text-xs text-center border-r border-table-border">{row.perPortion}</div>
              <div className="px-2 py-1 text-xs text-center">{row.percentDV}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t border-table-border">
        *Percentual de valores diários fornecidos pela porção.
      </div>
    </div>
  );
}
