import * as React from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const MagicCard = React.forwardRef<HTMLDivElement, MagicCardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg border border-gray-200 p-6 shadow-sm",
          hover &&
            "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MagicCard.displayName = "MagicCard";

export { MagicCard };
