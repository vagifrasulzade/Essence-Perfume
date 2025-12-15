import { Button } from "../ui/button";
import { X } from "lucide-react";

type Props = {
  selectedBrands: string[]
  // removed selectedCategories
  selectedVolumes: string[]
  selectedGenders?: string[]
  onRemoveBrand: (b: string) => void
  // removed onRemoveCategory
  onRemoveVolume: (v: string) => void
  onRemoveGender?: (g: string) => void
}

export default function ActiveFilter({
  selectedBrands,
  // removed selectedCategories
  selectedVolumes,
  selectedGenders,
  onRemoveBrand,
  // removed onRemoveCategory
  onRemoveVolume,
  onRemoveGender,
}: Props) {
  const anyActive =
    selectedBrands.length > 0 ||
    // removed selectedCategories check
    selectedVolumes.length > 0 ||
    (selectedGenders && selectedGenders.length > 0)

  if (!anyActive) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedBrands.map((brand) => (
        <Button key={brand} variant="secondary" size="sm" onClick={() => onRemoveBrand(brand)}>
          {brand}
          <X className="ml-2 h-3 w-3" />
        </Button>
      ))}

      {/* categories removed */}

      {selectedVolumes.map((volume) => (
        <Button key={volume} variant="secondary" size="sm" onClick={() => onRemoveVolume(volume)}>
          {volume}
          <X className="ml-2 h-3 w-3" />
        </Button>
      ))}

      {selectedGenders?.map((g: string) => (
        <Button key={g} variant="secondary" size="sm" onClick={() => onRemoveGender?.(g)}>
          {g}
          <X className="ml-2 h-3 w-3" />
        </Button>
      ))}
    </div>
  )
}