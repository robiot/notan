import { cn } from "@popup/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { useId } from "react";

const inputVariants = cva(
  "peer flex text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      placeholderStyle: {
        default: "py-1",
        alwaysVisible: "focus:pb-[0.25rem] focus:pt-[0.8rem] pb-[0.25rem] pt-[0.8rem] placeholder-shown:py-1",
      },
      variant: {
        default: "rounded-md border border-input bg-secondary",
      },
      inputSize: {
        default: "h-12 w-full px-3",
        small: "h-10 w-full px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      placeholderStyle: "default",
      inputSize: "default",
    },
  },
);

export interface InputProperties
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  showPassword?: boolean;
  setShowPassword?: (n: boolean) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProperties>(
  (
    { className, variant, placeholderStyle, inputSize, type, error, showPassword, setShowPassword, ...properties },
    reference,
  ) => {
    const id = useId();

    return (
      <>
        <div className="relative flex-1">
          <input
            id={id}
            type={showPassword ? undefined : type}
            className={cn(
              inputVariants({ variant, inputSize, placeholderStyle, className }),
              error && "border-red-600",
            )}
            ref={reference}
            {...properties}
            placeholder={placeholderStyle == "alwaysVisible" ? " " : properties.placeholder}
          />

          {properties.placeholder && placeholderStyle == "alwaysVisible" && (
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute text-sm text-muted-foreground duration-300 transform -translate-y-6 scale-75 top-1/2 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-6",
              )}>
              {properties.placeholder}
            </label>
          )}

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
