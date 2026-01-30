import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { NutritionForm } from '@/components/NutritionForm';
import { NutritionTable } from '@/components/NutritionTable';
import { NutritionTableHorizontal } from '@/components/NutritionTableHorizontal';
import { NutritionTableLinear } from '@/components/NutritionTableLinear';
import { ExportButtons } from '@/components/ExportButtons';
import { ExportPDFButton, PrintButton, LabelSizeSelector, SizeOption } from '@/components/ExportPDFButton';
import { FrontWarningsDisplay } from '@/components/FrontWarnings';
import { AllergenForm } from '@/components/AllergenForm';
import { AllergenDisplay, AllergenDisplayCompact } from '@/components/AllergenDisplay';
import { InfoSection } from '@/components/InfoSection';
import { NutritionData, DEFAULT_NUTRITION_DATA } from '@/types/nutrition';
import { calculateFrontWarnings } from '@/utils/nutritionCalculations';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableFormat, TABLE_FORMAT_LABELS } from '@/types/tableFormat';

const Index = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData>(DEFAULT_NUTRITION_DATA);
  const [tableFormat, setTableFormat] = useState<TableFormat>('vertical');
  const [labelSize, setLabelSize] = useState<SizeOption>('medio');
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

            <AllergenForm
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

            {/* Format selector */}
            <div className="no-print flex items-center gap-3">
              <Label htmlFor="table-format" className="text-sm font-medium whitespace-nowrap">
                Formato da tabela:
              </Label>
              <Select value={tableFormat} onValueChange={(value: TableFormat) => setTableFormat(value)}>
                <SelectTrigger id="table-format" className="w-40">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TABLE_FORMAT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card className="p-6 bg-card">
              {nutritionData.productName && (
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {nutritionData.productName}
                </h3>
              )}
              
              <div ref={tableRef} className="inline-block bg-white p-4 space-y-4">
                {tableFormat === 'vertical' && (
                  <NutritionTable data={nutritionData} />
                )}
                {tableFormat === 'horizontal' && (
                  <NutritionTableHorizontal data={nutritionData} />
                )}
                {tableFormat === 'linear' && (
                  <NutritionTableLinear data={nutritionData} />
                )}

                {/* Allergen declarations in export area */}
                <AllergenDisplayCompact data={nutritionData} />
              </div>
            </Card>

            <Separator />

            {/* Front Warnings */}
            <Card className="p-6 bg-card no-print">
              <FrontWarningsDisplay warnings={frontWarnings} />
            </Card>

            {/* Allergen Display Preview */}
            <Card className="p-6 bg-card no-print">
              <AllergenDisplay data={nutritionData} />
            </Card>

            <div className="no-print space-y-4">
              <ExportButtons tableRef={tableRef} />
              <Separator />
              <LabelSizeSelector value={labelSize} onChange={setLabelSize} />
              <div className="flex gap-3">
                <ExportPDFButton tableRef={tableRef} productName={nutritionData.productName} labelSize={labelSize} />
                <PrintButton tableRef={tableRef} labelSize={labelSize} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 no-print">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Tabela gerada conforme RDC 429/2020, IN 75/2020 e RDC 727/2022 da ANVISA.
            Valores diários de referência baseados em uma dieta de 2.000 kcal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
