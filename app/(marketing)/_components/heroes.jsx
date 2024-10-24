import Image from "next/image";

export default function Heroes() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image
            src="/documents.webp"
            fill
            className="object-contain dark:hidden"
            alt="Documents"
          />

          <Image
            src="/documents-dark.webp"
            fill
            className="object-contain hidden dark:block"
            alt="Documents"
          />
        </div>

        <div className="relative w-[400px] h-[400px] hidden md:block">
          <Image
            src="/reading.webp"
            fill
            className="object-contain dark:hidden"
            alt="Reading"
          />

          <Image
            src="/reading-dark.webp"
            fill
            className="object-contain hidden dark:block"
            alt="Reading"
          />
        </div>
      </div>
    </div>
  );
}
