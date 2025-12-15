"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
  sortBy: string
  setSortBy: (value: string) => void
}

export default function Sort({ sortBy, setSortBy }: Props) {

    return(
    <div className="relative">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 px-3 py-2 border rounded-md flex items-center justify-between">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="absolute mt-2 right-0 w-48 bg-white border rounded-md shadow-md z-50">
            <SelectItem value="featured" className="p-2 hover:bg-muted cursor-pointer">Featured</SelectItem>
            <SelectItem value="price-low" className="p-2 hover:bg-muted cursor-pointer">Price: Low to High</SelectItem>
            <SelectItem value="price-high" className="p-2 hover:bg-muted cursor-pointer">Price: High to Low</SelectItem>
            <SelectItem value="rating" className="p-2 hover:bg-muted cursor-pointer">Highest Rated</SelectItem>
            <SelectItem value="name" className="p-2 hover:bg-muted cursor-pointer">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
    </div>
    );
}