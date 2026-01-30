import { FrontWarnings as FrontWarningsType } from '@/types/nutrition';
import { cn } from '@/lib/utils';

interface FrontWarningsProps {
  warnings: FrontWarningsType;
  className?: string;
}

// Magnifying glass with "ALTO EM" text - per ANVISA RDC 429/2020
function MagnifyingGlass() {
  return (
    <svg viewBox="0 0 60 48" className="w-16 h-12 flex-shrink-0">
      {/* Background rounded rectangle */}
      <rect x="0" y="4" width="60" height="40" rx="4" fill="black" />
      {/* Magnifying glass circle */}
      <circle
        cx="20"
        cy="22"
        r="11"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
      />
      {/* Handle */}
      <line
        x1="28"
        y1="30"
        x2="36"
        y2="38"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Text ALTO EM inside magnifying glass */}
      <text
        x="20"
        y="20"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        ALTO
      </text>
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="bold"
        fill="white"
        fontFamily="Arial, sans-serif"
      >
        EM
      </text>
    </svg>
  );
}

// Nutrient label badge - per ANVISA format
function NutrientLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-10 px-3 bg-black rounded-sm min-w-[80px]">
      <span className="text-white text-[10px] font-bold uppercase tracking-wide text-center leading-tight">
        {text}
      </span>
    </div>
  );
}

// Complete warning badge with magnifying glass + nutrient labels
export function WarningBadge({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;
  
  return (
    <div className="inline-flex items-stretch gap-0.5">
      <MagnifyingGlass />
      {labels.map((label, index) => (
        <NutrientLabel key={index} text={label} />
      ))}
    </div>
  );
}

// Compact version for embedding in export area
export function FrontWarningsCompact({ warnings }: { warnings: FrontWarningsType }) {
  const activeWarnings: string[] = [];
  
  if (warnings.highAddedSugar) activeWarnings.push('Açúcar Adicionado');
  if (warnings.highSaturatedFat) activeWarnings.push('Gordura Saturada');
  if (warnings.highSodium) activeWarnings.push('Sódio');
  
  if (activeWarnings.length === 0) return null;
  
  return (
    <div className="pt-2">
      <WarningBadge labels={activeWarnings} />
    </div>
  );
}

export function FrontWarningsDisplay({ warnings, className }: FrontWarningsProps) {
  const activeWarnings: string[] = [];
  
  // Labels per ANVISA - exact text as shown in official guide
  if (warnings.highAddedSugar) activeWarnings.push('Açúcar Adicionado');
  if (warnings.highSaturatedFat) activeWarnings.push('Gordura Saturada');
  if (warnings.highSodium) activeWarnings.push('Sódio');
  
  const hasWarnings = activeWarnings.length > 0;
  
  if (!hasWarnings) {
    return (
      <div className={cn("text-center p-4 bg-accent/10 border border-accent/30 rounded-lg", className)}>
        <p className="text-accent font-medium text-sm">
          ✓ Nenhum alerta de rotulagem frontal
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          O produto não apresenta alto teor de açúcar adicionado, gordura saturada ou sódio.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-sm font-medium text-foreground">
        Rotulagem Nutricional Frontal (RDC 429/2020 e IN 75/2020)
      </p>
      
      <div className="flex justify-center p-4 bg-white rounded-lg border">
        <WarningBadge labels={activeWarnings} />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Símbolo obrigatório na parte frontal da embalagem conforme ANVISA.
        {activeWarnings.length === 1 && ' O produto é alto em 1 nutriente crítico.'}
        {activeWarnings.length === 2 && ' O produto é alto em 2 nutrientes críticos.'}
        {activeWarnings.length === 3 && ' O produto é alto em 3 nutrientes críticos.'}
      </p>
    </div>
  );
}

// Preview component showing all possible warnings
export function FrontWarningsPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Exemplo com 3 nutrientes:</p>
      <div className="flex flex-wrap items-center gap-0.5 bg-white p-2 rounded border inline-flex">
        <MagnifyingGlass />
        <NutrientLabel text="Açúcar Adicionado" />
        <NutrientLabel text="Gordura Saturada" />
        <NutrientLabel text="Sódio" />
      </div>
    </div>
  );
}
