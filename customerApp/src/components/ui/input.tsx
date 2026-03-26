import * as React from "react";

import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

const inputVariants = cva("w-full h-8 p-7 rounded-lg", {
  variants: {
    variant: {
      default:
        "border border-gray-300 bg-transparent text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    },
  },
});

function Input({
  className,
  variant = "default",
  asChild = false,
  type,
  label,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & { asChild?: boolean; label?: string }) {
  const Comp = asChild ? Slot.Root : "input";
  return (
    <div className="relative">
      <span className="text-xs absolute -top-2 left-6 px-1 bg-white text-gray-500">{label}</span>
      <Comp
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, className }))}
        {...props}
      />
    </div>
  );
}

export { Input };
