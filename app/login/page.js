"use client";

import { useState } from "react";

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
        window.location.href = "/user";
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* NAVBAR */}
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "18px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <a
            href="/"
            style={{
              textDecoration: "none",
              fontSize: "28px",
              fontWeight: "900",
              color: "#2563eb",
            }}
          >
            RETTOR
          </a>

          <div
            style={{
              display: "flex",
              gap: "25px",
            }}
          >

            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Beranda
            </a>

            <a
              href="/motor"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Motor
            </a>

            <a
              href="/login"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              Login
            </a>

            <a
              href="/register"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Register
            </a>

          </div>
        </div>
      </nav>


      {/* LOGIN */}
      <section
        style={{
          minHeight: "calc(100vh - 76px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "white",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
          }}
        >

          {/* JUDUL */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "35px",
              }}
            >
              🏍️
            </div>

            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "30px",
              }}
            >
              Selamat Datang
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              Login ke akun RETTOR RENTAL
            </p>

          </div>


          {/* FORM */}
          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label
                style={{
                  display: "block",
                  color: "#111827",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  color: "#111827",
                  background: "white",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />

            </div>


            {/* PASSWORD */}
            <div
              style={{
                marginBottom: "25px",
              }}
            >

              <label
                style={{
                  display: "block",
                  color: "#111827",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  color: "#111827",
                  background: "white",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />

            </div>


            {/* BUTTON LOGIN */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "9px",
                background: "#2563eb",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>

          </form>


          {/* REGISTER */}
          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
            }}
          >

            <p
              style={{
                color: "#6b7280",
                marginBottom: "8px",
              }}
            >
              Belum punya akun?
            </p>

            <a
              href="/register"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Daftar Sekarang
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}