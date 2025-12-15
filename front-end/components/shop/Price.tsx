import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

type Props = {
    value: [number, number]
    onChange: (next: [number, number]) => void
    maxPrice?: number
}

export default function PriceFilter({ value, onChange, maxPrice = 350 }: Props) {
    return (
        <div>
            <Label className="mb-3 block">Price Range: ${value[0]} - ${value[1]}</Label>
            <Slider min={0} max={maxPrice} step={10} value={value} onValueChange={onChange} className="mt-2" />
        </div>
    )
}
