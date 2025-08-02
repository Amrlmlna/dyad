import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Utility neuromorphism pakai variabel CSS
  "inline-flex items-center justify-center gap-2 whitespace-nowrap neu-bg neu-shadow neu-radius neu-transition disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive neu-shadow-inset",
  {
    variants: {
      variant: {
        default: "hover:opacity-90",
        destructive: "text-red-600 border-red-400 hover:opacity-90",
        outline: "border hover:opacity-90",
        secondary: "hover:opacity-90",
        ghost: "hover:opacity-90",
        link: "bg-transparent underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 neu-radius gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 neu-radius px-6 has-[>svg]:px-4",
        icon: "size-9",
        sidebar: "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
