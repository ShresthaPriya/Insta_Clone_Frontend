import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "md" | "full";
  isHovered?: boolean;
}
