import Link from "next/link";
import { cn } from "@/lib/utils";


type LogoProps = {
  className?: string;
  spanDesign?: string;
}

export default function Logo({ className, spanDesign }: LogoProps) {
    return (
        <Link href={"/"} className="inline-flex">
        <h2
          className={cn(
            "text-2xl text-black font-black tracking-wider uppercase hover:text-accent hoverEffect group font-sans",
            className
          )}
        >
          Essence
          <span
            className={cn(
              "text-accent group-hover:text-black hoverEffect",
              spanDesign
            )}
          >
            nce
          </span>
        </h2>
        </Link>
    );
}