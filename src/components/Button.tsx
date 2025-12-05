import type { ButtonProps } from "../types/form";
import { tv } from "tailwind-variants";
import clsx from "clsx";

const button = tv({
  base: "font-medium px-4 py-2 transition transform",
  variants: {
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-green-500 text-white",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    rounded: {
      none: "",
      md: "rounded-md",
      full: "rounded-full",
    },
  },
});

export const FormButton = ({
  text,
  color,
  size,
  rounded,
  isHovered = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        button({ size, color, rounded }),
        isHovered &&
          "hover:scale-105 hover:bg-opacity-90 transition-transform duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};
