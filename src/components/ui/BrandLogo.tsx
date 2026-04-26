import Image from "next/image";

type Size = "sm" | "md" | "lg";

type Props = {
  slug: string;
  name: string;
  size?: Size;
  className?: string;
};

const BRAND_LOGOS: Record<string, string> = {
  apple: "/brands/apple.svg",
  samsung: "/brands/samsung.svg",
};

const SIZES: Record<Size, { container: string; inner: string }> = {
  sm: { container: "w-24 h-12",  inner: "w-16 h-6"  },
  md: { container: "w-32 h-14",  inner: "w-24 h-8"  },
  lg: { container: "w-40 h-16",  inner: "w-28 h-10" },
};

export default function BrandLogo({ slug, name, size = "md", className = "" }: Props) {
  const src = BRAND_LOGOS[slug.toLowerCase()];
  const dim = SIZES[size];

  return (
    <div className={`${dim.container} flex items-center justify-center ${className}`}>
      {src ? (
        <div className={`relative ${dim.inner}`}>
          <Image src={src} alt={name} fill className="object-contain" />
        </div>
      ) : (
        <span className="text-2xl font-bold text-[#1d1d1f]">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}
