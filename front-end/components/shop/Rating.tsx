import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

type Props = {
    value: number
    onChange: (next: number) => void
}

export default function RatingFilter({ value, onChange }: Props) {
    return (
        <div>
            <Label className="mb-3 block">Minimum Rating: {value}⭐</Label>
            <Slider min={0} max={5} step={0.5} value={[value]} onValueChange={(v) => onChange(v[0])} className="mt-2" />
        </div>
    )
}