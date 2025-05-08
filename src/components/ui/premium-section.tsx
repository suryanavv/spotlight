import * as React from "react";
import { cn } from "@/lib/utils";

interface PremiumSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  container?: boolean;
  gradient?: boolean;
}

const PremiumSection = React.forwardRef<HTMLDivElement, PremiumSectionProps>(
  (
    { className, container = true, gradient = false, children, ...props },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "premium-section",
          gradient && "premium-gradient text-white",
          className,
        )}
        {...props}
      >
        <div className={cn(container && "container mx-auto")}>{children}</div>
      </section>
    );
  },
);

PremiumSection.displayName = "PremiumSection";

export { PremiumSection };
