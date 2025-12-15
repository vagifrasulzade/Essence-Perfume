import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Product } from "@/lib/products"

type Props = {
  selectedGenders: string[]
  setSelectedGenders: (value: string[]) => void
  products?: Product[]
}
const genders = ["women", "men", "kid"];


export default function GenderFilter({ selectedGenders, setSelectedGenders, products = [] }: Props) {
  const toggleGender = (gender: string) => {
    const lowerGender = gender.toLowerCase()
    setSelectedGenders(
      selectedGenders.map(g => g.toLowerCase()).includes(lowerGender)
        ? selectedGenders.filter((g) => g.toLowerCase() !== lowerGender)
        : [...selectedGenders, gender]
    )
  }

  // Get product count for each gender
  const getProductCount = (gender: string): number => {
    if (!products || products.length === 0) return 0
    return products.filter(p => {
      const prodGender = (p.gender || "").toString().toLowerCase()
      return prodGender === gender.toLowerCase()
    }).length
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Gender</h3>
      <div className="space-y-2">
        {genders.map((gender) => {
          const count = getProductCount(gender)
          return (
            <div key={gender} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <Checkbox
                  id={`gender-${gender}`}
                  checked={selectedGenders.map(g => g.toLowerCase()).includes(gender.toLowerCase())}
                  onCheckedChange={() => toggleGender(gender)}
                />
                <Label
                  htmlFor={`gender-${gender}`}
                  className="text-sm font-normal cursor-pointer capitalize flex-1"
                >
                  {gender === "kid" ? "Kids" : gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Label>
              </div>
              {products.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({count})
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
