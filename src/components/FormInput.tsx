import React from "react";
import { tv } from "tailwind-variants";
import clsx from "clsx";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder: string;
  label?: string;
  InputBorder?: "none" | "thin" | "thick" | "normal" | "btnShadow" | "profileBorder";
  isFocused?: boolean;
  className?: string;
}

const inputForm = tv({
  base: "w-full outline-none px-3 py-2",
  variants: {
    InputBorder: {
      none: "",
      thin: "border-b border-gray-300",
      thick: "border border-[1px] border-[#DBDBDB] rounded-sm",
      normal: "border-2",
      btnShadow: "shadow-lg",
      profileBorder: "rounded-3px border",
    },
  },
  defaultVariants: {
    InputBorder: "thin",
  },
});

const InputForm = ({
  type,
  label,
  placeholder,
  className,
  InputBorder,
  isFocused = false,
  ...props
}: InputFormProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={clsx(
          inputForm({ InputBorder }),
          isFocused && "focus:border-indigo-500",
          className
        )}
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default InputForm;
