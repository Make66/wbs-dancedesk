import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  [
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all",
    "bg-white text-gray-900 placeholder:text-gray-400",
    "border-gray-200 shadow-sm",
    "focus:border-gray-400 focus:ring-2 focus:ring-gray-200",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
    "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
    "dark:border-zinc-700 dark:focus:border-zinc-500 dark:focus:ring-zinc-800",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        ghost: [
          "border-transparent bg-gray-50 shadow-none",
          "focus:border-gray-300 focus:bg-white",
          "dark:bg-zinc-800 dark:focus:bg-zinc-900 dark:focus:border-zinc-600",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    wrapperClassName?: string;
  };

function Input({
  className,
  wrapperClassName,
  variant,
  type = "text",
  label,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 top-0 z-10 -translate-y-1/2 rounded-md px-2 text-xs font-medium",
            "bg-white text-gray-500",
            "dark:bg-zinc-900 dark:text-zinc-400",
          )}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant }), label && "pt-4", className)}
        {...props}
      />
    </div>
  );
}

export { Input };
