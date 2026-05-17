import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number | string;
  priority?: boolean;
}

export function Logo({
  className,
  height = 32,
  priority = false,
}: LogoProps) {
  return (
    <Image
      alt="BailKey Logo"
      src="/logo.png"
      width={150}
      height={40}
      style={{
        width: "auto",
        height: typeof height === "number" ? `${height}px` : height,
        objectFit: "contain",
      }}
      priority={priority}
      className={cn("max-w-full", className)}
    />
  );
}
