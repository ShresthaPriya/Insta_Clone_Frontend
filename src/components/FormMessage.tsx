import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface FormMessageProps extends React.ComponentProps<"p"> {
  variant?: "error" | "success" | "info";
  message?: string;
  className?: string;
}

const FormMessageStyles = {
  error: "text-red-500 text-sm mt-1",
  success: "text-green-500 text-sm mt-1",
  info: "text-blue-500 text-sm mt-1",
};

export const FormMessage = ({
  variant = "info",
  message,
  className,
  ...props
}: FormMessageProps) => {
  const mergedClasses = twMerge(
    clsx(FormMessageStyles[variant], className)
  );

  return (
    <p className={mergedClasses} {...props}>
      {message}
    </p>
  );
};


