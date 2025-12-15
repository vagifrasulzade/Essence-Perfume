import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type Props = {
  selectedVolumes: string[]
  onChange: (next: string[]) => void
}

export default function VolumeFilter({ selectedVolumes, onChange }: Props) {
  const volumes = ["30", "50", "75", "100", "150", "200"];
  const toggleVolume = (volume: string) => {
    onChange(selectedVolumes.includes(volume) ? selectedVolumes.filter((v) => v !== volume) : [...selectedVolumes, volume])
  }

  return (
    <div>
      <Label className="mb-3 block">Volume</Label>
      <div className="space-y-2">
        {volumes.map((volume: string) => (
          <div key={volume} className="flex items-center">
            <Checkbox id={`volume-${volume}`} checked={selectedVolumes.includes(volume)} onCheckedChange={() => toggleVolume(volume)} />
            <label htmlFor={`volume-${volume}`} className="ml-2 text-sm cursor-pointer">
              {volume}ml
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}