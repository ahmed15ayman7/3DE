"use client";
import React, { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSelect"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: AutocompleteOption[];
  isMulti?: boolean;
  defaultValue?: string;
  onSelect?: (values: string[] | string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  error,
  helperText,
  options,
  isMulti = false,
  onSelect,
  className,
  defaultValue,
  ...props
}) => {

  const [query, setQuery] = useState(defaultValue?defaultValue.toString():"");
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options);
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<AutocompleteOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(query.toLowerCase()) &&
          (!isMulti || !selectedValues.find((sel) => sel.value === option.value))
      )
    );
  }, [query, options, selectedValues, isMulti]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: AutocompleteOption) => {
    if (isMulti) {
      const newValues = [...selectedValues, option];
      setSelectedValues(newValues);
      if (onSelect) onSelect(newValues.map((v) => v.value));
      setQuery("");
    } else {
      setQuery(option.label);
      if (onSelect) onSelect(option.value);
      setOpen(false);
    }
  };

  const removeSelected = (value: string) => {
    const newValues = selectedValues.filter((v) => v.value !== value);
    setSelectedValues(newValues);
    if (onSelect) onSelect(newValues.map((v) => v.value));
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div
        className={clsx(
          "flex flex-wrap gap-2 px-2 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-primary-main focus-within:border-transparent",
          error ? "border-error-main" : "border-gray-300"
        )}
      >
        {isMulti &&
          selectedValues.map((item) => (
            <span
              key={item.value}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-primary-main text-white rounded"
            >
              {item.label}
              <button
                type="button"
                className="text-xs"
                onClick={() => removeSelected(item.value)}
              >
                ×
              </button>
            </span>
          ))}
        <input
          {...props}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (props.onChange) props.onChange(e);
          }}
          onFocus={() => setOpen(true)}
          className={clsx("flex-1 outline-none", className)}
        />
      </div>
      {open && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-auto shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-error-main">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
