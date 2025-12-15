import { Search } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function SearchFilter({ value, onChange }: Props) {
  return (
    <div>
      <Label>Search</Label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={value} onChange={(e) => onChange(e.target.value)} className="pl-10" />
      </div>
    </div>
  )
}