import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { DAILY_VALUES, WARNING_THRESHOLDS } from '@/types/nutrition';

export function InfoSection() {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Referência ANVISA</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="vd">
          <AccordionTrigger className="text-sm">
            Valores Diários de Referência (VD)
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <p><strong>Valor energético:</strong> {DAILY_VALUES.energyKcal} kcal</p>
                <p><strong>Carboidratos:</strong> {DAILY_VALUES.carbohydrates} g</p>
                <p><strong>Açúcares:</strong> {DAILY_VALUES.totalSugars} g</p>
                <p><strong>Proteínas:</strong> {DAILY_VALUES.proteins} g</p>
                <p><strong>Gorduras totais:</strong> {DAILY_VALUES.totalFats} g</p>
              </div>
              <div className="space-y-1">
                <p><strong>Gorduras saturadas:</strong> {DAILY_VALUES.saturatedFats} g</p>
                <p><strong>Fibras:</strong> {DAILY_VALUES.dietaryFiber} g</p>
                <p><strong>Sódio:</strong> {DAILY_VALUES.sodium} mg</p>
                <p><strong>Cálcio:</strong> {DAILY_VALUES.calcium} mg</p>
                <p><strong>Ferro:</strong> {DAILY_VALUES.iron} mg</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="warnings">
          <AccordionTrigger className="text-sm">
            Limites para Alertas Frontais
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Alimentos Sólidos (por 100g):</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Açúcar adicionado: ≥{WARNING_THRESHOLDS.solid.addedSugar}g</li>
                  <li>Gordura saturada: ≥{WARNING_THRESHOLDS.solid.saturatedFat}g</li>
                  <li>Sódio: ≥{WARNING_THRESHOLDS.solid.sodium}mg</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Alimentos Líquidos (por 100ml):</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Açúcar adicionado: ≥{WARNING_THRESHOLDS.liquid.addedSugar}g</li>
                  <li>Gordura saturada: ≥{WARNING_THRESHOLDS.liquid.saturatedFat}g</li>
                  <li>Sódio: ≥{WARNING_THRESHOLDS.liquid.sodium}mg</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="legislation">
          <AccordionTrigger className="text-sm">
            Legislação Aplicável
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>RDC 429/2020:</strong> Regulamenta a rotulagem nutricional de alimentos embalados.</p>
              <p><strong>IN 75/2020:</strong> Estabelece os requisitos técnicos para declaração da rotulagem nutricional.</p>
              <p><strong>RDC 259/2002:</strong> Define requisitos para lista de ingredientes.</p>
              <p className="text-xs mt-2">A partir de outubro de 2023, a rotulagem frontal com símbolos de lupa é obrigatória.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
