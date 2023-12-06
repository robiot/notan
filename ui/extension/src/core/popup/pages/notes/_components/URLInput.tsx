import { forwardRef, InputHTMLAttributes } from "react";

import { cn } from "@/core/popup/lib/utils";

export interface InputProperties extends InputHTMLAttributes<HTMLInputElement> {
  currentValue?: string;
}

const URLInput = forwardRef<HTMLInputElement, InputProperties>(
  ({ className, currentValue, ...properties }, reference) => {
    return (
      <div className="max-w-[500px] box-border">
        <div className="overflow-hidden min-w-[2rem] max-w-[14rem] h-8 relative">
          <span className="text-sm inline-block relative min-w-[2px] h-0 invisible">{currentValue}</span>
          <input
            className={cn("text-sm focus:outline-none bg-transparent h-full top-0 left-0 absolute w-full", className)}
            ref={reference}
            {...properties}
          />
        </div>
      </div>
    );
  },
);

URLInput.displayName = "URLInput";

export { URLInput };
