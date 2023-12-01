import { cn } from "@popup/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

export interface InputProperties extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showPassword?: boolean;
  setShowPassword?: (n: boolean) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProperties>(
  ({ className, type, error, showPassword, setShowPassword, ...properties }, reference) => {
    return (
      <>
        <div className="relative">
          <input
            type={showPassword ? undefined : type}
            className={cn(
              "flex h-12 w-full rounded-md border border-input bg-secondary px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-600",
              className,
            )}
            ref={reference}
            {...properties}
          />
          {type === "password" && (
            <button
              className="absolute right-0 top-0 h-full flex items-center pr-3"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              type="button">
              {showPassword ? (
                <Eye className="text-xs" size={"1.3rem"} />
              ) : (
                <EyeOff className="text-xs" size={"1.3rem"} />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-sm !text-red-600 !opacity-100">{error}</span>}
      </>
    );
  },
);

Input.displayName = "Input";

export { Input };
