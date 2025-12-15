import React from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { useState } from "react"

type Props = {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export default function Mobile({ children }: Props) {
    const [filterOpen, setFilterOpen] = useState(false)

    return (
        <div className="flex items-center gap-2">
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="lg" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="h-5 w-5 mr-2 font-bold" />
                        Filters
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-80 overflow-y-auto bg-white p-6">
                    <SheetHeader>
                        <div className="flex items-center justify-between">
                            <SheetTitle>Filters</SheetTitle>
                            <Button variant="ghost" size="sm" onClick={() => setFilterOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </SheetHeader>

                    <div className="mt-6">{children}</div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
