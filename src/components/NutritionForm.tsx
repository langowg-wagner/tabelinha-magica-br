import { NutritionData } from '@/types/nutrition';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NutritionFormProps {
  data: NutritionData;
  onChange: (data: NutritionData) => void;
}

export function NutritionForm({ data, onChange }: NutritionFormProps) {
  const handleChange = (field: keyof NutritionData, value: string | boolean) => {
    if (typeof value === 'boolean') {
      onChange({ ...data, [field]: value });
      return;
    }
    const numValue = parseFloat(value) || 0;
    onChange({
      ...data,
      [field]: field === 'productName' || field === 'portionDescription' ? value : numValue,
    });
  };

  const handleStringChange = (field: keyof NutritionData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="form-section">
        <h3 className="form-section-title">Informações do Produto</h3>
        <div className="space-y-4">
          <div className="input-grid">
            <div className="space-y-2">
              <Label htmlFor="productName">Nome do Produto</Label>
              <Input
                id="productName"
                placeholder="Ex: Biscoito Integral"
                value={data.productName}
                onChange={(e) => handleStringChange('productName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portionsPerPackage">Porções por Embalagem</Label>
              <Input
                id="portionsPerPackage"
                type="number"
                min="1"
                placeholder="Ex: 10"
                value={data.portionsPerPackage || ''}
                onChange={(e) => handleChange('portionsPerPackage', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portionSize">Tamanho da Porção (g/ml)</Label>
              <Input
                id="portionSize"
                type="number"
                min="1"
                placeholder="Ex: 30"
                value={data.portionSize || ''}
                onChange={(e) => handleChange('portionSize', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portionDescription">Medida Caseira</Label>
              <Input
                id="portionDescription"
                placeholder="Ex: (1 unidade)"
                value={data.portionDescription}
                onChange={(e) => handleStringChange('portionDescription', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            <Switch
              id="isLiquid"
              checked={data.isLiquid}
              onCheckedChange={(checked) => handleChange('isLiquid', checked)}
            />
            <Label htmlFor="isLiquid" className="text-sm cursor-pointer">
              Produto líquido (afeta os limites de rotulagem frontal)
            </Label>
          </div>
        </div>
      </div>

      {/* Nutritional Values */}
      <Tabs defaultValue="macros" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
          <TabsTrigger value="vitamins">Vitaminas e Minerais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="macros" className="mt-4">
          <div className="form-section">
            <h3 className="form-section-title">Valores por 100g/100ml</h3>
            <div className="input-grid">
              <div className="space-y-2">
                <Label htmlFor="energyKcal100g">Valor Energético (kcal)</Label>
                <Input
                  id="energyKcal100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.energyKcal100g || ''}
                  onChange={(e) => handleChange('energyKcal100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbohydrates100g">Carboidratos (g)</Label>
                <Input
                  id="carbohydrates100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.carbohydrates100g || ''}
                  onChange={(e) => handleChange('carbohydrates100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSugars100g">Açúcares Totais (g)</Label>
                <Input
                  id="totalSugars100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.totalSugars100g || ''}
                  onChange={(e) => handleChange('totalSugars100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addedSugars100g">
                  Açúcares Adicionados (g)
                  <span className="text-xs text-muted-foreground ml-1">*alerta frontal</span>
                </Label>
                <Input
                  id="addedSugars100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.addedSugars100g || ''}
                  onChange={(e) => handleChange('addedSugars100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proteins100g">Proteínas (g)</Label>
                <Input
                  id="proteins100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.proteins100g || ''}
                  onChange={(e) => handleChange('proteins100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalFats100g">Gorduras Totais (g)</Label>
                <Input
                  id="totalFats100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.totalFats100g || ''}
                  onChange={(e) => handleChange('totalFats100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saturatedFats100g">
                  Gorduras Saturadas (g)
                  <span className="text-xs text-muted-foreground ml-1">*alerta frontal</span>
                </Label>
                <Input
                  id="saturatedFats100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.saturatedFats100g || ''}
                  onChange={(e) => handleChange('saturatedFats100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transFats100g">Gorduras Trans (g)</Label>
                <Input
                  id="transFats100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.transFats100g || ''}
                  onChange={(e) => handleChange('transFats100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietaryFiber100g">Fibras Alimentares (g)</Label>
                <Input
                  id="dietaryFiber100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.dietaryFiber100g || ''}
                  onChange={(e) => handleChange('dietaryFiber100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodium100g">
                  Sódio (mg)
                  <span className="text-xs text-muted-foreground ml-1">*alerta frontal</span>
                </Label>
                <Input
                  id="sodium100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.sodium100g || ''}
                  onChange={(e) => handleChange('sodium100g', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vitamins" className="mt-4">
          <div className="form-section">
            <h3 className="form-section-title">Vitaminas e Minerais (Opcional)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Declare apenas quando fizerem parte da composição natural ou forem ≥5% do VD.
            </p>
            <div className="input-grid">
              <div className="space-y-2">
                <Label htmlFor="vitaminA100g">Vitamina A (μg)</Label>
                <Input
                  id="vitaminA100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.vitaminA100g || ''}
                  onChange={(e) => handleChange('vitaminA100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitaminC100g">Vitamina C (mg)</Label>
                <Input
                  id="vitaminC100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.vitaminC100g || ''}
                  onChange={(e) => handleChange('vitaminC100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitaminD100g">Vitamina D (μg)</Label>
                <Input
                  id="vitaminD100g"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={data.vitaminD100g || ''}
                  onChange={(e) => handleChange('vitaminD100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitaminE100g">Vitamina E (mg)</Label>
                <Input
                  id="vitaminE100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.vitaminE100g || ''}
                  onChange={(e) => handleChange('vitaminE100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calcium100g">Cálcio (mg)</Label>
                <Input
                  id="calcium100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.calcium100g || ''}
                  onChange={(e) => handleChange('calcium100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iron100g">Ferro (mg)</Label>
                <Input
                  id="iron100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.iron100g || ''}
                  onChange={(e) => handleChange('iron100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potassium100g">Potássio (mg)</Label>
                <Input
                  id="potassium100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.potassium100g || ''}
                  onChange={(e) => handleChange('potassium100g', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zinc100g">Zinco (mg)</Label>
                <Input
                  id="zinc100g"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={data.zinc100g || ''}
                  onChange={(e) => handleChange('zinc100g', e.target.value)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
