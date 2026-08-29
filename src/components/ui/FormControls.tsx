"use client";

import type { ReactNode } from "react";

export const fieldInputClass =
  "block w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]";

export function LabeledField({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
      >
        {label}
        {optional && (
          <span className="ml-1 text-xs font-normal text-[var(--color-foreground-subtle)]">
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={fieldInputClass} />;
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly string[];
    placeholder?: string;
  },
) {
  const { options, placeholder, ...rest } = props;
  return (
    <select {...rest} className={fieldInputClass}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
