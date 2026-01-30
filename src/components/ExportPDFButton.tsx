import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Size options in mm (width of the label) with pixelRatio for quality
const SIZE_OPTIONS = {
  'pequeno': { label: 'Pequeno (30mm)', width: 30, pixelRatio: 8 },
  'medio': { label: 'Médio (50mm)', width: 50, pixelRatio: 6 },
  'grande': { label: 'Grande (80mm)', width: 80, pixelRatio: 4 },
  'muito-grande': { label: 'Muito Grande (120mm)', width: 120, pixelRatio: 3 },
  'pagina-inteira': { label: 'Página Inteira', width: 170, pixelRatio: 2 },
} as const;

type SizeOption = keyof typeof SIZE_OPTIONS;

interface ExportPDFButtonProps {
  tableRef: React.RefObject<HTMLDivElement>;
  productName?: string;
  labelSize: SizeOption;
}

export function ExportPDFButton({ tableRef, productName, labelSize }: ExportPDFButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!tableRef.current) {
      toast({
        title: 'Erro',
        description: 'Rótulo não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the pixelRatio based on size (higher for smaller sizes = sharper text)
      const pixelRatio = SIZE_OPTIONS[labelSize].pixelRatio;
      
      // Capture the label as PNG image with high resolution
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: pixelRatio,
        cacheBust: true,
        skipFonts: true,
        filter: (node: HTMLElement) => !node.classList?.contains('no-export'),
      });

      // Get image dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // Get the target width in mm based on size option
      const targetWidthMM = SIZE_OPTIONS[labelSize].width;
      
      // Calculate dimensions
      const imgWidth = img.width;
      const imgHeight = img.height;
      const aspectRatio = imgHeight / imgWidth;
      const scaledHeight = targetWidthMM * aspectRatio;

      // A4 dimensions in mm: 210 x 297
      const pdfWidth = 210;
      const pdfHeight = 297;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Center the image on the page
      const xOffset = (pdfWidth - targetWidthMM) / 2;
      
      // Add title if product name exists
      let yOffset = 20;
      if (productName) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(productName, pdfWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;
      }

      // Add the image at the specified size
      doc.addImage(dataUrl, 'PNG', xOffset, yOffset, targetWidthMM, scaledHeight);

      // Add size info at bottom
      const footerY = yOffset + scaledHeight + 8;
      if (footerY < pdfHeight - 15) {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text(`Tamanho: ${SIZE_OPTIONS[labelSize].label} | RDC 429/2020, IN 75/2020, RDC 727/2022 ANVISA`, pdfWidth / 2, footerY, { align: 'center' });
      }

      // Save PDF
      const fileName = productName 
        ? `rotulo-${productName.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : 'rotulo-nutricional.pdf';
      
      doc.save(fileName);

      toast({
        title: 'PDF gerado!',
        description: `Rótulo exportado no tamanho ${SIZE_OPTIONS[labelSize].label}.`,
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

interface PrintButtonProps {
  tableRef: React.RefObject<HTMLDivElement>;
  labelSize: SizeOption;
}

export function PrintButton({ tableRef, labelSize }: PrintButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    if (!tableRef.current) {
      toast({
        title: 'Erro',
        description: 'Rótulo não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the pixelRatio based on size (higher for smaller sizes = sharper text)
      const pixelRatio = SIZE_OPTIONS[labelSize].pixelRatio;
      
      // Capture the label as PNG image with high resolution
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: pixelRatio,
        cacheBust: true,
        skipFonts: true,
        filter: (node: HTMLElement) => !node.classList?.contains('no-export'),
      });

      // Get the target width in mm based on size option
      const targetWidthMM = SIZE_OPTIONS[labelSize].width;

      // Open print window with the image at specific size
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: 'Erro',
          description: 'Não foi possível abrir a janela de impressão. Verifique se pop-ups estão habilitados.',
          variant: 'destructive',
        });
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Rótulo Nutricional</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding: 10mm;
                background: white;
              }
              .label-container {
                width: ${targetWidthMM}mm;
              }
              img {
                width: 100%;
                height: auto;
                display: block;
              }
              @media print {
                body {
                  padding: 0;
                }
                .label-container {
                  width: ${targetWidthMM}mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <img src="${dataUrl}" alt="Rótulo Nutricional" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

    } catch (error) {
      console.error('Erro ao preparar impressão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível preparar a impressão. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePrint} 
      disabled={isLoading} 
      variant="outline" 
      className="gap-2"
    >
      <Printer className="h-4 w-4" />
      {isLoading ? 'Preparando...' : 'Imprimir'}
    </Button>
  );
}

// Size selector component
interface LabelSizeSelectorProps {
  value: SizeOption;
  onChange: (value: SizeOption) => void;
}

export function LabelSizeSelector({ value, onChange }: LabelSizeSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="label-size" className="text-sm font-medium whitespace-nowrap">
        Tamanho do rótulo:
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="label-size" className="w-48">
          <SelectValue placeholder="Selecione o tamanho" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SIZE_OPTIONS).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type { SizeOption };
