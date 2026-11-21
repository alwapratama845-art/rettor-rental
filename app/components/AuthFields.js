"use client";

import { useId, useState } from "react";

const inputClass =
  "h-14 w-full rounded-lg border border-[#d9e1db] bg-white px-4 text-sm text-[#172f2c] placeholder:text-[#74847d] focus:border-[#087f6d] focus:outline-none focus:ring-2 focus:ring-[#087f6d]/20";
const labelClass = "text-sm font-semibold leading-normal text-[#172f2c]";

export function TextField({ label, ...props }) {
  const id = useId();
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} {...props} className={inputClass} />
    </div>
  );
}

export function PasswordField({ label, ...props }) {
  const id = useId();
  const [lihat, setLihat] = useState(false);
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        <input id={id} {...props} type={lihat ? "text" : "password"} className={`${inputClass} pr-20`} />
        <button
          type="button"
          onClick={() => setLihat(!lihat)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#087f6d]"
        >
          {lihat ? "Sembunyi" : "Lihat"}
        </button>
      </div>
    </div>
  );
}