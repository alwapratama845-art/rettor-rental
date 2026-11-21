"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "../components/AuthShell";
import { TextField, PasswordField } from "../components/AuthFields";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== konfirmasi) {
      alert("Konfirmasi password tidak sama!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registrasi berhasil!");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <AuthShell judulKiri={["Satu akun.", "Banyak tujuan."]}>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-[10px]">
          <p className="text-[11px] font-semibold leading-normal text-[#087f6d]">AKUN RETTOR</p>
          <h1 className="text-4xl font-normal leading-[1.2] text-[#172f2c]">Daftar akun</h1>
          <p className="text-sm leading-normal text-[#687773]">Buat akun Rettor untuk mulai perjalanan pertamamu.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <TextField
              label="Nama Lengkap"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
            <PasswordField
              label="Konfirmasi Password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>
          <button
            type="submit"
            className="h-[52px] w-full rounded-lg bg-[#d7eb95] text-sm font-semibold text-[#172f2c] transition hover:bg-[#cfe585]"
          >
            Daftar
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="h-px w-full bg-[#dee6df]" />
          <p className="flex justify-center gap-1.5 text-sm leading-normal">
            <span className="text-[#687773]">Sudah punya akun?</span>
            <Link href="/login" className="font-semibold text-[#087f6d]">Login sekarang</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}