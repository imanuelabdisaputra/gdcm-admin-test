import * as React from "react";
import { FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  containerClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, type, ...props }, ref) => {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
