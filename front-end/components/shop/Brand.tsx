import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

type Props = {
  selectedBrands: string[]
  onChange: (next: string[]) => void
}

const brands = [
  "Dior",
  "Chanel",
  "Tom Ford",
  "Versace",
  "Giorgio Armani",
  "YSL",
  "Gucci",
  "Prada",
  "Dolce & Gabbana",
  "Paco Rabanne",
  "Calvin Klein",
  "Hugo Boss",
  "Burberry",
  "Givenchy",
  "Jean Paul Gaultier",
  "Creed",
  "MFK",
  "Amouage",
  "Initio",
  "By Kilian",
  "Montale",
  "Mancera"
]

const INITIAL_SHOW_COUNT = 8

export default function BrandFilter({ selectedBrands, onChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleBrand = (brand: string) => {
    onChange(selectedBrands.includes(brand) ? selectedBrands.filter((b) => b !== brand) : [...selectedBrands, brand])
  }

  const visibleBrands = isExpanded ? brands : brands.slice(0, INITIAL_SHOW_COUNT)
  const hasMoreBrands = brands.length > INITIAL_SHOW_COUNT

  return (
    <div>
      <Label className="mb-3 block">Brand</Label>
      <div className="space-y-2">
        {visibleBrands.map((brand: string, idx: number) => {
          // Create a stable, unique key/id even when brand names repeat
          const safeId = `brand-${brand}-${idx}`.replace(/[^a-zA-Z0-9-_]/g, "-")
          return (
            <div key={`${brand}-${idx}`} className="flex items-center">
              <Checkbox id={safeId} checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
              <label htmlFor={safeId} className="ml-2 text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          )
        })}
      </div>
      {hasMoreBrands && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show more ({brands.length - INITIAL_SHOW_COUNT} more)
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}