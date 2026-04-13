import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light active:scale-[0.98] shadow-sm",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98]",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98]",
  ghost: "text-primary hover:bg-slate-100 active:scale-[0.98]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-all duration-150 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 20v-4l-3 3 3 3v-2a8 8 0 01-8-8z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
