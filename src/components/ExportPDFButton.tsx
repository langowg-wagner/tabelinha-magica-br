import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { NutritionData, ALLERGENS, AllergenId } from '@/types/nutrition';
import { generateTableRows } from '@/utils/nutritionCalculations';
import { calculateFrontWarnings } from '@/utils/nutritionCalculations';

interface ExportPDFButtonProps {
  data: NutritionData;
}

function getAllergenLabel(id: AllergenId): string {
  return ALLERGENS.find((a) => a.id === id)?.label || id;
}

export function ExportPDFButton({ data }: ExportPDFButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    setIsLoading(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const unit = data.isLiquid ? 'ml' : 'g';
      const rows = generateTableRows(data);
      const warnings = calculateFrontWarnings(data);
      
      let yPos = 20;
      const leftMargin = 20;
      const pageWidth = 170;

      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      if (data.productName) {
        doc.text(data.productName, leftMargin, yPos);
        yPos += 10;
      }

      // === NUTRITION TABLE ===
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(0, 0, 0);
      doc.rect(leftMargin, yPos, pageWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('INFORMAÇÃO NUTRICIONAL', leftMargin + pageWidth / 2, yPos + 5.5, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      yPos += 10;

      // Portion info
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Porções por embalagem: ${data.portionsPerPackage || '000'} porções`, leftMargin, yPos);
      yPos += 4;
      doc.text(`Porção: ${data.portionSize || '000'} ${unit} ${data.portionDescription}`, leftMargin, yPos);
      yPos += 6;

      // Table header
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPos, leftMargin + pageWidth, yPos);
      yPos += 1;

      const col1 = leftMargin;
      const col2 = leftMargin + 90;
      const col3 = leftMargin + 115;
      const col4 = leftMargin + 145;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('', col1, yPos + 4);
      doc.text(`100 ${unit}`, col2, yPos + 4);
      doc.text(`${data.portionSize || '000'} ${unit}`, col3, yPos + 4);
      doc.text('%VD*', col4, yPos + 4);
      yPos += 6;
      doc.line(leftMargin, yPos, leftMargin + pageWidth, yPos);
      yPos += 1;

      // Table rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      rows.forEach((row) => {
        const indent = row.indentLevel ? row.indentLevel * 3 : 0;
        doc.text(row.label, col1 + indent, yPos + 3.5);
        doc.text(row.per100g, col2, yPos + 3.5);
        doc.text(row.perPortion, col3, yPos + 3.5);
        doc.text(row.percentDV, col4, yPos + 3.5);
        yPos += 5;
        doc.setLineWidth(0.1);
        doc.line(leftMargin, yPos, leftMargin + pageWidth, yPos);
      });

      yPos += 2;
      doc.setFontSize(7);
      doc.text('*Percentual de valores diários fornecidos pela porção.', leftMargin, yPos);
      yPos += 10;

      // === FRONT WARNINGS ===
      const activeWarnings: string[] = [];
      if (warnings.highAddedSugar) activeWarnings.push('AÇÚCAR ADICIONADO');
      if (warnings.highSaturatedFat) activeWarnings.push('GORDURA SATURADA');
      if (warnings.highSodium) activeWarnings.push('SÓDIO');

      if (activeWarnings.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('ROTULAGEM NUTRICIONAL FRONTAL', leftMargin, yPos);
        yPos += 6;

        doc.setFillColor(0, 0, 0);
        doc.roundedRect(leftMargin, yPos, 25, 12, 1, 1, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.text('ALTO', leftMargin + 12.5, yPos + 5, { align: 'center' });
        doc.text('EM', leftMargin + 12.5, yPos + 9, { align: 'center' });
        doc.setTextColor(0, 0, 0);

        let xOffset = leftMargin + 27;
        activeWarnings.forEach((warning) => {
          const textWidth = doc.getTextWidth(warning) + 6;
          doc.roundedRect(xOffset, yPos, textWidth, 12, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.text(warning, xOffset + textWidth / 2, yPos + 7, { align: 'center' });
          doc.setTextColor(0, 0, 0);
          xOffset += textWidth + 2;
        });

        yPos += 18;
      }

      // === ALLERGEN DECLARATIONS ===
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('DECLARAÇÕES OBRIGATÓRIAS', leftMargin, yPos);
      yPos += 6;

      doc.setFontSize(9);

      // Allergens
      const allergenParts: string[] = [];
      if (data.allergens.contains.length > 0) {
        const names = data.allergens.contains.map(getAllergenLabel).join(', ');
        allergenParts.push(`CONTÉM ${names.toUpperCase()}`);
      }
      if (data.allergens.containsDerivatives.length > 0) {
        const names = data.allergens.containsDerivatives.map(getAllergenLabel).join(', ');
        allergenParts.push(`DERIVADOS DE ${names.toUpperCase()}`);
      }
      if (data.allergens.mayContain.length > 0) {
        const names = data.allergens.mayContain.map(getAllergenLabel).join(', ');
        allergenParts.push(`PODE CONTER ${names.toUpperCase()}`);
      }

      if (allergenParts.length > 0) {
        const allergenText = `ALÉRGICOS: ${allergenParts.join(' E ')}.`;
        const lines = doc.splitTextToSize(allergenText, pageWidth);
        doc.text(lines, leftMargin, yPos);
        yPos += lines.length * 4 + 2;
      }

      // Lactose
      if (data.lactoseStatus === 'contains') {
        doc.text('CONTÉM LACTOSE', leftMargin, yPos);
        yPos += 5;
      }

      // Gluten
      const glutenText = data.glutenStatus === 'contains' ? 'CONTÉM GLÚTEN' : 'NÃO CONTÉM GLÚTEN';
      doc.text(glutenText, leftMargin, yPos);
      yPos += 10;

      // Footer
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Tabela gerada conforme RDC 429/2020, IN 75/2020 e RDC 727/2022 da ANVISA.', leftMargin, yPos);
      yPos += 3;
      doc.text('Valores diários de referência baseados em uma dieta de 2.000 kcal.', leftMargin, yPos);

      // Save PDF
      const fileName = data.productName 
        ? `rotulo-${data.productName.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : 'rotulo-nutricional.pdf';
      
      doc.save(fileName);

      toast({
        title: 'PDF gerado!',
        description: 'O arquivo PDF foi baixado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o PDF. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExportPDF} 
      disabled={isLoading} 
      variant="outline" 
      className="gap-2"
    >
      <FileText className="h-4 w-4" />
      {isLoading ? 'Gerando...' : 'Baixar PDF'}
    </Button>
  );
}
