import { NutritionData, ALLERGENS, AllergenId } from '@/types/nutrition';
import { cn } from '@/lib/utils';

interface AllergenDisplayProps {
  data: NutritionData;
  className?: string;
}

function getAllergenLabel(id: AllergenId): string {
  return ALLERGENS.find((a) => a.id === id)?.label || id;
}

export function AllergenDisplay({ data, className }: AllergenDisplayProps) {
  const { allergens, glutenStatus, lactoseStatus } = data;

  // Build allergen declaration text per RDC 727/2022
  const buildAllergenText = (): string | null => {
    const parts: string[] = [];

    // Contains
    if (allergens.contains.length > 0) {
      const names = allergens.contains.map(getAllergenLabel).join(', ');
      parts.push(`contém ${names}`);
    }

    // Contains derivatives
    if (allergens.containsDerivatives.length > 0) {
      const names = allergens.containsDerivatives.map(getAllergenLabel).join(', ');
      parts.push(`derivados de ${names}`);
    }

    // May contain (cross-contamination)
    if (allergens.mayContain.length > 0) {
      const names = allergens.mayContain.map(getAllergenLabel).join(', ');
      parts.push(`pode conter ${names}`);
    }

    if (parts.length === 0) return null;

    return `ALÉRGICOS: ${parts.join(' e ').toUpperCase()}.`;
  };

  const allergenText = buildAllergenText();
  const hasGluten = glutenStatus === 'contains';
  const hasLactose = lactoseStatus === 'contains';
  const hasAnyDeclaration = allergenText || hasLactose;

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm font-medium text-foreground">
        Declarações Obrigatórias (RDC 727/2022)
      </p>

      {/* Allergens */}
      {allergenText && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-bold text-black uppercase">
            {allergenText}
          </p>
        </div>
      )}

      {/* Lactose */}
      {hasLactose && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-bold text-black uppercase">
            CONTÉM LACTOSE
          </p>
        </div>
      )}

      {/* Gluten - always required */}
      <div className="p-3 bg-muted border rounded-lg">
        <p className="text-sm font-bold text-foreground uppercase">
          {hasGluten ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN'}
        </p>
      </div>

      {!hasAnyDeclaration && (
        <p className="text-xs text-muted-foreground">
          Nenhum alergênico ou lactose declarado. A declaração de glúten é sempre obrigatória.
        </p>
      )}
    </div>
  );
}

// Compact version for export/print
export function AllergenDisplayCompact({ data, className }: AllergenDisplayProps) {
  const { allergens, glutenStatus, lactoseStatus } = data;

  const buildAllergenText = (): string | null => {
    const parts: string[] = [];

    if (allergens.contains.length > 0) {
      const names = allergens.contains.map(getAllergenLabel).join(', ');
      parts.push(`CONTÉM ${names.toUpperCase()}`);
    }

    if (allergens.containsDerivatives.length > 0) {
      const names = allergens.containsDerivatives.map(getAllergenLabel).join(', ');
      parts.push(`DERIVADOS DE ${names.toUpperCase()}`);
    }

    if (allergens.mayContain.length > 0) {
      const names = allergens.mayContain.map(getAllergenLabel).join(', ');
      parts.push(`PODE CONTER ${names.toUpperCase()}`);
    }

    if (parts.length === 0) return null;

    return `ALÉRGICOS: ${parts.join(' E ')}.`;
  };

  const allergenText = buildAllergenText();
  const hasGluten = glutenStatus === 'contains';
  const hasLactose = lactoseStatus === 'contains';

  return (
    <div className={cn('space-y-1 text-xs', className)}>
      {allergenText && (
        <p className="font-bold text-black uppercase">{allergenText}</p>
      )}
      {hasLactose && (
        <p className="font-bold text-black uppercase">CONTÉM LACTOSE</p>
      )}
      <p className="font-bold text-black uppercase">
        {hasGluten ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN'}
      </p>
    </div>
  );
}
