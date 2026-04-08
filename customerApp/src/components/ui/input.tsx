import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  [
    "h-22 w-full rounded-xl border border-muted-foreground px-5 py-5 text-sm outline-none text-xl",
    "text-foreground placeholder:text-zinc-400",
    "bg-white text-zinc-900 placeholder:text-zinc-400",
    "focus:border-3",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
    "dark:bg-background dark:text-foreground dark:placeholder:text-zinc-500",
    "dark:focus:border-zinc-500 dark:focus:ring-zinc-800",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        ghost: [
          "border-transparent bg-gray-50 shadow-none",
          "focus:border-zinc-300 focus:bg-white",
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
            "absolute left-3 top-0 z-10 -translate-y-1/2 rounded-md px-2 text-xs",
            "bg-white text-zinc-900 tracking-wider",
            "dark:bg-background dark:text-zinc-300",
          )}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    </div>
  );
}

export { Input };
