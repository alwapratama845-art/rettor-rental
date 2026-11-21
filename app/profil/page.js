"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inter, Icon, SiteNav, SiteFooter } from "../components/site";

export default function ProfilPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const dataUser = localStorage.getItem("rettor_user");

    if (!dataUser) {
      window.location.href = "/login";
      return;
    }

    try {
      setUser(JSON.parse(dataUser));
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      localStorage.removeItem("rettor_user");
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    const yakin = confirm("Apakah kamu yakin ingin keluar dari akun?");

    if (!yakin) return;

    localStorage.removeItem("rettor_user");

    alert("Kamu berhasil logout.");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className={`${inter.className} flex min-h-screen items-center justify-center bg-white`}>
        <p className="text-sm text-[#687773]">Memuat profil...</p>
      </div>
    );
  }

  const inisial = user.nama ? user.nama.charAt(0).toUpperCase() : "U";

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={user.nama} login aktif="profil" />

      <main className="flex-1 leading-[normal]">
        {/* ================= HERO ================= */}
        <HeroHalaman baris1="Profil" baris2="Saya" />

        {/* ================= KONTEN ================= */}
        <section className="flex flex-col gap-10 px-6 pb-20 pt-[72px] lg:flex-row lg:items-start lg:gap-16 lg:px-20">
          {/* KARTU IDENTITAS */}
          <div className="flex flex-col gap-8 rounded-2xl bg-[#103f37] p-8 lg:min-h-[381px] lg:w-[355px] lg:shrink-0">
            <span className="flex size-[88px] items-center justify-center rounded-full bg-[#e7f3ec] text-[30px] font-semibold text-[#087f6d]">
              {inisial}
            </span>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-[13px] text-[#e7f3ec]">Selamat datang,</p>
              <p className="break-words text-[24px] font-semibold leading-[1.2] tracking-[-0.5px] text-white">
                {user.nama}
              </p>
              <p className="break-all text-xs text-[#e7f3ec]">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-white/25 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>

          {/* INFORMASI AKUN */}
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.8px] text-[#172f2c]">
              Informasi Akun
            </h2>
            <p className="mt-3 text-[13px] text-[#687773]">Berikut informasi akun yang terdaftar di Rettor.</p>

            <div className="mt-6 flex flex-col">
              <Baris label="Nama Lengkap">
                <span className="text-sm font-semibold text-[#172f2c]">{user.nama}</span>
              </Baris>
              <Baris label="Email">
                <span className="break-all text-sm font-semibold text-[#172f2c]">{user.email}</span>
              </Baris>
              <Baris label="Status Akun">
                <span className="inline-block rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold capitalize text-[#087f6d]">
                  {user.role || "user"}
                </span>
              </Baris>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pesanan"
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-[#dee5df] bg-white text-sm font-semibold text-[#172f2c]"
              >
                Lihat Pesanan Saya
              </Link>
              <Link
                href="/motor"
                className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#d7eb95] text-sm font-semibold text-[#172f2c]"
              >
                Sewa Motor
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Baris({ label, children }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#dee5df] py-5 sm:flex-row sm:items-center sm:gap-0">
      <p className="text-[13px] text-[#687773] sm:w-[250px] sm:shrink-0">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// Hero krem: judul di kiri, foto di kanan (sama seperti Beranda).
function HeroHalaman({ baris1, baris2 }) {
  return (
    <section className="flex flex-col bg-[#f6f3ea] px-6 pb-8 lg:h-[330px] lg:flex-row lg:px-20 lg:pb-0">
      <div className="flex flex-col items-start gap-6 pb-8 pt-[52px] lg:w-[308px] lg:shrink-0 lg:pb-0">
        <div className="flex items-center gap-2">
          <span className="size-[7px] rounded-full bg-[#087f6d]" />
          <p className="text-xs font-bold tracking-[1.5px] text-[#087f6d]">DKI Jakarta</p>
        </div>

        <h1 className="text-[44px] font-normal leading-[1.07] tracking-[-2px] text-[#172f2c] lg:text-[62px] lg:tracking-[-3px]">
          {baris1}
          <br />
          {baris2}
        </h1>
      </div>

      <div className="relative min-h-[240px] flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/login-hero.png" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />

        <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white px-[14px] py-[10px]">
          <Icon name="map-pin" className="size-4 text-[#087f6d]" />
          <p className="whitespace-nowrap text-xs font-semibold text-[#172f2c]">DKI Jakarta</p>
        </div>
      </div>
    </section>
  );
}