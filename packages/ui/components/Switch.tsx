"use client";

import { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export  function Switch({ checked, onChange, disabled }: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isChecked;
    if (!isControlled) setInternalChecked(newState);
    onChange?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 ease-in-out
        ${isChecked ? "bg-primary" : "bg-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out
          ${isChecked ? "translate-x-4" : "translate-x-1"}
        `}
      />
    </button>
  );
}
