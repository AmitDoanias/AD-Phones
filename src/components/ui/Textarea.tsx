import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`
            w-full px-3 py-2 rounded-lg border text-sm bg-white resize-none
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-slate-50 disabled:text-slate-400
            placeholder:text-slate-400 transition-colors
            ${error ? "border-red-400" : "border-slate-300 hover:border-slate-400"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
