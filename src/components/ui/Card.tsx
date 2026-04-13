interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-slate-200 shadow-sm
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
