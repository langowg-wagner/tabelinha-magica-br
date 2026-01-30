import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

interface ExportPDFButtonProps {
  tableRef: React.RefObject<HTMLDivElement>;
  productName?: string;
}

export function ExportPDFButton({ tableRef, productName }: ExportPDFButtonProps) {
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
      // Capture the label as PNG image (same as the PNG export)
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
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

      // Create PDF with proper dimensions
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      // A4 dimensions in mm: 210 x 297
      const pdfWidth = 210;
      const maxImgWidth = pdfWidth - 40; // 20mm margins on each side
      const scale = maxImgWidth / (imgWidth / 2); // Divide by pixelRatio
      const scaledHeight = (imgHeight / 2) * scale;

      const doc = new jsPDF({
        orientation: scaledHeight > 250 ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add title if product name exists
      let yOffset = 20;
      if (productName) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(productName, pdfWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;
      }

      // Add the image
      doc.addImage(dataUrl, 'PNG', 20, yOffset, maxImgWidth, scaledHeight);

      // Add footer
      const footerY = yOffset + scaledHeight + 10;
      if (footerY < 280) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Tabela gerada conforme RDC 429/2020, IN 75/2020 e RDC 727/2022 da ANVISA.', pdfWidth / 2, footerY, { align: 'center' });
      }

      // Save PDF
      const fileName = productName 
        ? `rotulo-${productName.toLowerCase().replace(/\s+/g, '-')}.pdf`
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

interface PrintButtonProps {
  tableRef: React.RefObject<HTMLDivElement>;
}

export function PrintButton({ tableRef }: PrintButtonProps) {
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
      // Capture the label as PNG image
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        filter: (node: HTMLElement) => !node.classList?.contains('no-export'),
      });

      // Open print window with the image
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
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
                background: white;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              @media print {
                body {
                  padding: 0;
                }
                img {
                  max-width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Rótulo Nutricional" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 250);
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
