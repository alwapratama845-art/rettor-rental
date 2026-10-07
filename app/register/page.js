"use client";

import { useState } from "react";

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
    <main className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <a
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            RETTOR
          </a>

          <div className="flex gap-8">

            <a
              href="/"
              className="text-gray-900 hover:text-blue-600"
            >
              Beranda
            </a>

            <a
              href="/motor"
              className="text-gray-900 hover:text-blue-600"
            >
              Motor
            </a>

            <a
              href="/login"
              className="text-gray-900 hover:text-blue-600"
            >
              Login
            </a>

          </div>
        </div>
      </nav>

      {/* REGISTER */}
      <section className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">

        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Daftar Akun
            </h1>

            <p className="text-gray-700 mt-2">
              Buat akun RETTOR RENTAL
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* NAMA */}
            <div>

              <label className="block text-gray-900 font-semibold mb-2">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-gray-900 font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-gray-900 font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* KONFIRMASI */}
            <div>

              <label className="block text-gray-900 font-semibold mb-2">
                Konfirmasi Password
              </label>

              <input
                type="password"
                value={konfirmasi}
                onChange={(e) => setKonfirmasi(e.target.value)}
                placeholder="Ulangi password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
            >
              Daftar
            </button>

          </form>

          <div className="text-center mt-6">

            <p className="text-gray-700">
              Sudah punya akun?
            </p>

            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login sekarang
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}