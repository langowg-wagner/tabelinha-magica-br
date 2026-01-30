import { Button } from '@/components/ui/button';
import { Download, Printer, Copy } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { toPng, toJpeg, toSvg } from 'html-to-image';

type ExportFormat = 'png' | 'jpg' | 'svg';

interface ExportButtonsProps {
  tableRef: React.RefObject<HTMLDivElement>;
}

export function ExportButtons({ tableRef }: ExportButtonsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1); // 1x, 2x, 3x, 4x multiplier
  const [format, setFormat] = useState<ExportFormat>('png');

  const handlePrint = () => {
    window.print();
  };

  const getExportOptions = (pixelRatio: number) => ({
    backgroundColor: '#ffffff',
    pixelRatio,
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });

  const generateImage = async (): Promise<string | null> => {
    if (!tableRef.current) return null;

    // Use scale directly as pixelRatio (1x = base, 2x = double, etc.)
    const options = getExportOptions(scale);

    switch (format) {
      case 'png':
        return await toPng(tableRef.current, options);
      case 'jpg':
        return await toJpeg(tableRef.current, { ...options, quality: 0.95 });
      case 'svg':
        return await toSvg(tableRef.current, options);
      default:
        return null;
    }
  };

  const getMimeType = (): string => {
    switch (format) {
      case 'png': return 'image/png';
      case 'jpg': return 'image/jpeg';
      case 'svg': return 'image/svg+xml';
      default: return 'image/png';
    }
  };

  const getFileExtension = (): string => {
    return format === 'jpg' ? 'jpg' : format;
  };

  const handleCopyAsImage = async () => {
    if (!tableRef.current) {
      toast({
        title: 'Erro',
        description: 'Tabela não encontrada.',
        variant: 'destructive',
      });
      return;
    }

    if (format === 'svg') {
      toast({
        title: 'Aviso',
        description: 'SVG não pode ser copiado para a área de transferência. Use PNG ou JPG.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) throw new Error('Failed to generate image');

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [getMimeType()]: blob })
      ]);

      toast({
        title: 'Copiado!',
        description: `Tabela copiada como ${format.toUpperCase()} (${scale}x).`,
      });
    } catch (error) {
      console.error('Erro ao copiar imagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar a imagem. Tente baixar em vez disso.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!tableRef.current) {
      toast({
        title: 'Erro',
        description: 'Tabela não encontrada.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) throw new Error('Failed to generate image');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `tabela-nutricional.${getFileExtension()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Download concluído!',
        description: `Imagem ${format.toUpperCase()} baixada em ${scale}x.`,
      });
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar a imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Format and Scale Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Format Selector */}
        <div className="space-y-2">
          <Label htmlFor="format-select" className="text-sm font-medium">
            Formato
          </Label>
          <Select value={format} onValueChange={(value: ExportFormat) => setFormat(value)}>
            <SelectTrigger id="format-select">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (alta qualidade)</SelectItem>
              <SelectItem value="jpg">JPG (arquivo menor)</SelectItem>
              <SelectItem value="svg">SVG (vetorial)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Scale Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="scale-slider" className="text-sm font-medium">
              Tamanho
            </Label>
            <span className="text-sm text-muted-foreground font-mono">
              {scale}x
            </span>
          </div>
          <Slider
            id="scale-slider"
            min={1}
            max={4}
            step={1}
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1x (pequeno)</span>
            <span>2x</span>
            <span>3x</span>
            <span>4x (grande)</span>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleDownload} disabled={isLoading} className="gap-2">
          <Download className="h-4 w-4" />
          {isLoading ? 'Gerando...' : `Baixar ${format.toUpperCase()}`}
        </Button>
        <Button 
          onClick={handleCopyAsImage} 
          disabled={isLoading || format === 'svg'} 
          variant="secondary" 
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copiar Imagem
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>
    </div>
  );
}
