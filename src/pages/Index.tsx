import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { NutritionForm } from '@/components/NutritionForm';
import { NutritionTable } from '@/components/NutritionTable';
import { ExportButtons } from '@/components/ExportButtons';
import { FrontWarningsDisplay } from '@/components/FrontWarnings';
import { InfoSection } from '@/components/InfoSection';
import { NutritionData, DEFAULT_NUTRITION_DATA } from '@/types/nutrition';
import { calculateFrontWarnings } from '@/utils/nutritionCalculations';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData>(DEFAULT_NUTRITION_DATA);
  const tableRef = useRef<HTMLDivElement>(null);
  
  const frontWarnings = calculateFrontWarnings(nutritionData);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6 no-print">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Dados Nutricionais
              </h2>
              <p className="text-muted-foreground">
                Preencha os valores por 100g/100ml. Os cálculos por porção e %VD serão feitos automaticamente.
              </p>
            </div>
            
            <NutritionForm 
              data={nutritionData} 
              onChange={setNutritionData} 
            />
            
            <InfoSection />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="no-print">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Visualização
              </h2>
              <p className="text-muted-foreground">
                Prévia da tabela nutricional e alertas no formato oficial ANVISA.
              </p>
            </div>

            <Card className="p-6 bg-card">
              {nutritionData.productName && (
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {nutritionData.productName}
                </h3>
              )}
              
              <div ref={tableRef} className="inline-block bg-card p-4">
                <NutritionTable data={nutritionData} />
              </div>
            </Card>

            <Separator />

            {/* Front Warnings */}
            <Card className="p-6 bg-card no-print">
              <FrontWarningsDisplay warnings={frontWarnings} />
            </Card>

            <div className="no-print">
              <ExportButtons tableRef={tableRef} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 no-print">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Tabela gerada conforme RDC 429/2020 e IN 75/2020 da ANVISA.
            Valores diários de referência baseados em uma dieta de 2.000 kcal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
