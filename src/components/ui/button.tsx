import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90",
        destructive: "bg-black text-white hover:bg-black/90",
        outline: "border border-gray-200 bg-white hover:bg-gray-50 text-black",
        secondary: "bg-gray-100 text-black hover:bg-gray-200",
        ghost: "hover:bg-gray-50 text-black",
        link: "text-black underline-offset-4 hover:underline",
        minimal: "text-black hover:bg-gray-50 p-0 h-auto",
        premium: "relative bg-white/70 backdrop-blur border border-gray-200 text-black font-bold px-6 py-2 rounded-md shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-95 before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-black/10 before:to-gray-200/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 rounded-md px-3 py-1.5 text-sm",
        lg: "h-12 rounded-md px-8 py-3 text-lg",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
