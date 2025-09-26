"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

const Avatar = React.forwardRef(
  ({ className, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
          />
        )}
        {fallback && (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
            {fallback}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = ({ className, ...props }) => (
  <img
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
);

const AvatarFallback = ({
  className,
  ...props
}) => (
  <span
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100",
      className
    )}
    {...props}
  />
);

export { Avatar, AvatarImage, AvatarFallback };