import { FrontWarnings as FrontWarningsType } from '@/types/nutrition';
import { cn } from '@/lib/utils';

interface FrontWarningsProps {
  warnings: FrontWarningsType;
  className?: string;
}

function MagnifyingGlass() {
  return (
    <div className="flex items-center justify-center w-14 h-10 bg-primary rounded-sm">
      <svg viewBox="0 0 48 40" className="w-10 h-8">
        {/* Magnifying glass circle */}
        <circle
          cx="18"
          cy="18"
          r="12"
          fill="none"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="3"
        />
        {/* Handle */}
        <line
          x1="27"
          y1="27"
          x2="38"
          y2="36"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Text ALTO EM */}
        <text
          x="18"
          y="15"
          textAnchor="middle"
          fontSize="5"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
        >
          ALTO
        </text>
        <text
          x="18"
          y="22"
          textAnchor="middle"
          fontSize="5"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
        >
          EM
        </text>
      </svg>
    </div>
  );
}

function WarningLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-10 px-3 bg-primary rounded-sm">
      <span className="text-primary-foreground text-xs font-bold uppercase tracking-wide whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}

function WarningBadge({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      <MagnifyingGlass />
      {labels.map((label, index) => (
        <WarningLabel key={index} text={label} />
      ))}
    </div>
  );
}

export function FrontWarningsDisplay({ warnings, className }: FrontWarningsProps) {
  const activeWarnings: string[] = [];
  
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
        Rotulagem Nutricional Frontal (ANVISA)
      </p>
      
      <div className="flex justify-center p-4 bg-muted rounded-lg">
        <WarningBadge labels={activeWarnings} />
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Símbolos obrigatórios na parte frontal da embalagem conforme RDC 429/2020 e IN 75/2020.
      </p>
    </div>
  );
}

// Preview component showing all possible warnings
export function FrontWarningsPreview() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Exemplo de rotulagem completa:</p>
      <div className="flex flex-wrap items-center gap-0.5">
        <MagnifyingGlass />
        <WarningLabel text="Açúcar Adicionado" />
        <WarningLabel text="Gordura Saturada" />
        <WarningLabel text="Sódio" />
      </div>
    </div>
  );
}
