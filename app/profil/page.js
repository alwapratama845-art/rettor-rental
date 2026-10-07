"use client";

import { useEffect, useState } from "react";

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
      <main
        style={{
          minHeight: "100vh",
          background: "#F0F7FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          color: "#111827",
        }}
      >
        <h2>Memuat profil...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0F7FF",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 50,
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
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              fontSize: "28px",
              fontWeight: "900",
              color: "#0F4CDB",
              letterSpacing: "1px",
            }}
          >
            RETTOR
          </a>

          <div
            style={{
              display: "flex",
              gap: "25px",
              alignItems: "center",
              flexWrap: "wrap",
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
              href="/pesanan"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Pesanan Saya
            </a>

            <a
              href="/profil"
              style={{
                textDecoration: "none",
                color: "#0F4CDB",
                fontWeight: "800",
              }}
            >
              Profil
            </a>
          </div>
        </div>
      </nav>

      {/* HERO PROFIL */}
      <section
        style={{
          minHeight: "330px",
          background:
            "linear-gradient(90deg, rgba(15,76,219,0.96) 0%, rgba(15,76,219,0.82) 45%, rgba(15,76,219,0.55) 75%, rgba(15,76,219,0.35) 100%), url('/rettor-pesanan-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "60px 25px",
            color: "white",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "15px",
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Akun RETTOR
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: "900",
            }}
          >
            Profil Saya
          </h1>

          <p
            style={{
              marginTop: "14px",
              fontSize: "17px",
              lineHeight: "1.7",
              maxWidth: "600px",
              color: "#eaf2ff",
            }}
          >
            Kelola informasi akun dan lihat aktivitas penyewaan motor kamu
            di RETTOR RENTAL.
          </p>
        </div>
      </section>

      {/* KONTEN PROFIL */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "55px 25px 70px",
        }}
      >
        {/* CARD UTAMA */}
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 10px 35px rgba(15,76,219,0.10)",
            border: "1px solid #e5eefc",
          }}
        >
          {/* HEADER PROFIL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              marginBottom: "35px",
              paddingBottom: "30px",
              borderBottom: "1px solid #e5e7eb",
              flexWrap: "wrap",
            }}
          >
            {/* AVATAR */}
            <div
              style={{
                width: "105px",
                height: "105px",
                minWidth: "105px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #0F4CDB 0%, #2563eb 100%)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "42px",
                fontWeight: "900",
                boxShadow: "0 8px 20px rgba(15,76,219,0.25)",
              }}
            >
              {user.nama
                ? user.nama.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 5px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Selamat datang,
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {user.nama}
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6b7280",
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* INFORMASI AKUN */}
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            Informasi Akun
          </h3>

          <p
            style={{
              margin: "0 0 20px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Berikut informasi akun yang terdaftar di RETTOR.
          </p>

          {/* NAMA */}
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "12px",
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                margin: "0 0 5px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Nama Lengkap
            </p>

            <strong
              style={{
                color: "#111827",
                fontSize: "17px",
              }}
            >
              {user.nama}
            </strong>
          </div>

          {/* EMAIL */}
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "12px",
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                margin: "0 0 5px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Email
            </p>

            <strong
              style={{
                color: "#111827",
                fontSize: "17px",
              }}
            >
              {user.email}
            </strong>
          </div>

          {/* ROLE */}
          <div
            style={{
              padding: "18px 20px",
              marginBottom: "30px",
              background: "#F8FAFC",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                color: "#6b7280",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Status Akun
            </p>

            <span
              style={{
                display: "inline-block",
                background: "#DCFCE7",
                color: "#15803D",
                padding: "7px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "13px",
                textTransform: "capitalize",
              }}
            >
              {user.role || "user"}
            </span>
          </div>

          {/* TOMBOL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <a
              href="/pesanan"
              style={{
                display: "block",
                textAlign: "center",
                padding: "15px",
                borderRadius: "10px",
                background: "#EFF6FF",
                color: "#0F4CDB",
                textDecoration: "none",
                fontWeight: "bold",
                border: "1px solid #DBEAFE",
              }}
            >
              Lihat Pesanan Saya
            </a>

            <a
              href="/motor"
              style={{
                display: "block",
                textAlign: "center",
                padding: "15px",
                borderRadius: "10px",
                background: "#0F4CDB",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                boxShadow: "0 5px 15px rgba(15,76,219,0.20)",
              }}
            >
              Sewa Motor
            </a>

            <button
              onClick={handleLogout}
              style={{
                gridColumn: "1 / -1",
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #FECACA",
                background: "#FEF2F2",
                color: "#DC2626",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0B1220",
          color: "white",
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        <strong
          style={{
            fontSize: "20px",
            letterSpacing: "1px",
          }}
        >
          RETTOR RENTAL
        </strong>

        <p
          style={{
            margin: "8px 0 0",
            color: "#9CA3AF",
            fontSize: "14px",
          }}
        >
          Solusi rental motor mudah dan terpercaya.
        </p>

        <p
          style={{
            margin: "15px 0 0",
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
          © 2026 RETTOR RENTAL. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}