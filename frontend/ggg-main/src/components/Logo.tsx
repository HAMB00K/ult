import Image from 'next/image';

interface LogoProps {
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function Logo({ className, width, height, priority = false }: LogoProps) {
  return (
    <Image
      src="/securibot.png"
      alt="Securibot Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
