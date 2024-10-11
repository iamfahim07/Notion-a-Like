import { Poppins } from "next/font/google";
import Image from "next/image";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Logo() {
  return (
    <div className="hidden w-full md:flex items-center gap-x-2">
      <Image src="/Notion-logo.svg" width="40" height="40" alt="Notion Logo" />

      <p className={cn("font-semibold", font.className)}>Notion a Like</p>
    </div>
  );
}
