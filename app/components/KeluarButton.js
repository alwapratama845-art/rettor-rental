"use client";

// Tombol "Log out" merah di navbar (tampil kalau sudah login).
export default function KeluarButton() {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("rettor_user");
        window.location.href = "/";
      }}
      className="flex h-12 cursor-pointer items-center justify-center rounded-lg border border-[#ff383c] bg-[#ff383c] px-[22px] text-sm font-semibold text-white"
    >
      Log out
    </button>
  );
}