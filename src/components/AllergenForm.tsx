import { NutritionData, ALLERGENS, AllergenId } from '@/types/nutrition';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AllergenFormProps {
  data: NutritionData;
  onChange: (data: NutritionData) => void;
}

export function AllergenForm({ data, onChange }: AllergenFormProps) {
  const toggleAllergen = (
    category: 'contains' | 'containsDerivatives' | 'mayContain',
    allergenId: AllergenId,
    checked: boolean
  ) => {
    const current = data.allergens[category];
    const updated = checked
      ? [...current, allergenId]
      : current.filter((id) => id !== allergenId);

    onChange({
      ...data,
      allergens: {
        ...data.allergens,
        [category]: updated,
      },
    });
  };

  const isChecked = (
    category: 'contains' | 'containsDerivatives' | 'mayContain',
    allergenId: AllergenId
  ) => {
    return data.allergens[category].includes(allergenId);
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Alergênicos, Glúten e Lactose</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Conforme RDC 727/2022 e Lei 10.674/2003
      </p>

      <Accordion type="multiple" className="w-full space-y-2">
        {/* Gluten */}
        <AccordionItem value="gluten" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            Glúten
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={data.glutenStatus}
              onValueChange={(value) =>
                onChange({ ...data, glutenStatus: value as 'contains' | 'free' })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contains" id="gluten-contains" />
                <Label htmlFor="gluten-contains" className="text-sm font-normal">
                  CONTÉM GLÚTEN
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="gluten-free" />
                <Label htmlFor="gluten-free" className="text-sm font-normal">
                  NÃO CONTÉM GLÚTEN
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Lactose */}
        <AccordionItem value="lactose" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            Lactose
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={data.lactoseStatus}
              onValueChange={(value) =>
                onChange({ ...data, lactoseStatus: value as 'contains' | 'none' })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contains" id="lactose-contains" />
                <Label htmlFor="lactose-contains" className="text-sm font-normal">
                  CONTÉM LACTOSE ({'>'} 100mg/100g ou 100ml)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="lactose-none" />
                <Label htmlFor="lactose-none" className="text-sm font-normal">
                  Não declarar (sem lactose ou ≤ 100mg)
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-2">
              Nota: Expressões como "zero lactose" só podem ser usadas em alimentos para fins especiais.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Allergens - Contains */}
        <AccordionItem value="allergens-contains" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            Contém (alergênicos)
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">
              Selecione os alimentos alergênicos presentes no produto.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGENS.map((allergen) => (
                <div key={allergen.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`contains-${allergen.id}`}
                    checked={isChecked('contains', allergen.id)}
                    onCheckedChange={(checked) =>
                      toggleAllergen('contains', allergen.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`contains-${allergen.id}`}
                    className="text-xs font-normal cursor-pointer"
                  >
                    {allergen.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Allergens - Contains Derivatives */}
        <AccordionItem value="allergens-derivatives" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            Contém derivados de
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">
              Selecione os alimentos cujos derivados estão presentes.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGENS.map((allergen) => (
                <div key={allergen.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`derivatives-${allergen.id}`}
                    checked={isChecked('containsDerivatives', allergen.id)}
                    onCheckedChange={(checked) =>
                      toggleAllergen('containsDerivatives', allergen.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`derivatives-${allergen.id}`}
                    className="text-xs font-normal cursor-pointer"
                  >
                    {allergen.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Allergens - May Contain */}
        <AccordionItem value="allergens-may-contain" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium">
            Pode conter (contaminação cruzada)
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-muted-foreground mb-3">
              Selecione os alimentos que podem estar presentes por contaminação cruzada.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ALLERGENS.map((allergen) => (
                <div key={allergen.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`maycontain-${allergen.id}`}
                    checked={isChecked('mayContain', allergen.id)}
                    onCheckedChange={(checked) =>
                      toggleAllergen('mayContain', allergen.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`maycontain-${allergen.id}`}
                    className="text-xs font-normal cursor-pointer"
                  >
                    {allergen.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
