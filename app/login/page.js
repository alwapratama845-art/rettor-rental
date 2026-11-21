"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "../components/AuthShell";
import { TextField, PasswordField } from "../components/AuthFields";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login gagal.");
        return;
      }

      // Simpan data user yang login
      localStorage.setItem(
        "rettor_user",
        JSON.stringify(data.user)
      );

      alert(`Login berhasil!\n\nSelamat datang, ${data.user.nama}`);

      // ADMIN
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      }

      // USER
      else {
        window.location.href = "/";
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <AuthShell judulKiri={["Kotanya baru.", "Bebas jalannya."]}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-[10px]">
          <p className="text-[11px] font-semibold leading-normal text-[#087f6d]">AKUN RETTOR</p>
          <h1 className="text-4xl font-normal leading-[1.2] text-[#172f2c]">Selamat datang kembali.</h1>
          <p className="text-sm leading-normal text-[#687773]">Login ke akun Rettor dan lanjutkan perjalananmu.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
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
          </div>
          <button
            type="submit"
            className="h-[52px] w-full rounded-lg bg-[#d7eb95] text-sm font-semibold text-[#172f2c] transition hover:bg-[#cfe585]"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="h-px w-full bg-[#dee6df]" />
          <p className="flex justify-center gap-1.5 text-sm leading-normal">
            <span className="text-[#687773]">Belum punya akun?</span>
            <Link href="/register" className="font-semibold text-[#087f6d]">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};