import React from "react";
import clsx from "clsx";

interface SelectFormProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  className?: string;
}

const SelectForm = ({ label, options, className, ...props }: SelectFormProps) => {
  return (
    <div className="flex flex-row w-80px gap-1 justify-center items-center">
      {label && (
        <label className="text-base font-semibold text-#262626 w-2xs">{label}</label>
      )}

      <select
        className={clsx(
          "border border-[#DBDBDB] rounded-sm p-2 outline-none w-full",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectForm;
