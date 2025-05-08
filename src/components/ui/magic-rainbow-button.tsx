import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const magicRainbowButtonVariants = cva("magic-rainbow-button", {
  variants: {
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface MagicRainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof magicRainbowButtonVariants> {
  asChild?: boolean;
}

const MagicRainbowButton = React.forwardRef<
  HTMLButtonElement,
  MagicRainbowButtonProps
>(({ className, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(magicRainbowButtonVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  );
});

MagicRainbowButton.displayName = "MagicRainbowButton";

export { MagicRainbowButton, magicRainbowButtonVariants };
