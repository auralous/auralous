import clsx from "clsx";
import { CSSProperties, forwardRef } from "react";

interface InputProps {
  id: string;
  name: string;
  style: CSSProperties;
  placeholder: string;
  accessibilityLabel: string;
  fullWidth: boolean;
  disabled: boolean;
  required: boolean;
  type: string;
  maxLength: number;
  value: string;
  onChangeText(text: string): void;
  size?: "xs" | "sm" | "lg" | "xl";
  shape?: "circle" | "round";
}

const Input = forwardRef<HTMLInputElement, Partial<InputProps>>(function Input(
  {
    id,
    name,
    style,
    placeholder,
    accessibilityLabel,
    fullWidth,
    required,
    disabled,
    type,
    value,
    onChangeText,
    size,
    shape,
  },
  ref
) {
  return (
    <input
      id={id}
      name={name}
      style={style}
      ref={ref}
      className={clsx(
        "input",
        fullWidth && "w-full",
        size === "xs" && "px-2 h-6 text-xs",
        size === "sm" && "w-8 h-8 text-sm",
        size === "lg" && "w-12 h-12 text-md",
        size === "xl" && "w-16 h-16 text-lg",
        !size && `h-10` && `w-10 h-10`,
        shape === "circle" && "rounded-full"
      )}
      placeholder={placeholder}
      aria-label={accessibilityLabel}
      required={required}
      disabled={disabled}
      type={type}
      value={value}
      onChange={
        onChangeText
          ? (event) => onChangeText(event.currentTarget.value)
          : undefined
      }
    />
  );
});

export default Input;
