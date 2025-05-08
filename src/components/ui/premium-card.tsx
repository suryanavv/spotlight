import * as React from "react";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  shimmer?: boolean;
  glass?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      className,
      hover = true,
      shimmer = false,
      glass = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "premium-card p-6",
          hover && "premium-hover",
          shimmer && "overflow-hidden relative",
          glass && "bg-white/70 backdrop-blur-md",
          className,
        )}
        {...props}
      >
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full premium-shimmer z-0"></div>
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

PremiumCard.displayName = "PremiumCard";

export { PremiumCard };
