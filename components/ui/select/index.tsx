import type * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Label } from "../label";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
  type selectTriggerVariants,
} from "./base";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string | React.ReactNode;
  value: string;
  disabled?: boolean;
  description?: string;
};

export interface SelectProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive>,
    "value" | "onValueChange"
  >,
  VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  options?: SelectOption[];
  label?: string;
  error?: string;
  description?: React.ReactNode;
  showAsterisk?: boolean;
  className?: string;
  triggerClassName?: string;
  groupLabel?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select = ({
  placeholder = "Select an option",
  options,
  label,
  groupLabel,
  children,
  className,
  triggerClassName,
  error,
  description,
  showAsterisk,
  status,
  disabled,
  value,
  onValueChange,
  ...props
}: SelectProps) => {
  let containerStatus: VariantProps<typeof selectTriggerVariants>["status"] =
    status;

  if (error) containerStatus = "error";
  if (disabled) containerStatus = "disabled";

  return (
    <div className={cn("flex w-full flex-col space-y-1", className)}>
      {label && (
        <Label>
          {label}
          {showAsterisk && <span className="text-red-500">*</span>}
        </Label>
      )}

      <SelectPrimitive
        disabled={disabled}
        value={value}
        onValueChange={(val: any) => onValueChange?.(val as string)}
        {...props}
      >
        <SelectTrigger className={triggerClassName} status={containerStatus}>
          <SelectValue placeholder={placeholder}>
            {value && options
              ? options.find((o) => o.value === value)?.label
              : undefined}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-w-[400px]">
          {options ? (
            <SelectGroup>
              {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}

              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="whitespace-normal break-words"
                >
                  {option.description ? (
                    <div className="flex flex-col gap-1 py-1">
                      <span className="font-medium whitespace-normal break-words">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-normal break-words">
                        {option.description}
                      </span>
                    </div>
                  ) : (
                    <span className="whitespace-normal break-words">
                      {option.label}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            children
          )}
        </SelectContent>
      </SelectPrimitive>

      {description && (
        <p className="text-gray-500 text-xs dark:text-gray-400">
          {description}
        </p>
      )}

      {error && <p className="text-[#F04248] text-xs">{error}</p>}
    </div>
  );
};

export {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
} from "./base";