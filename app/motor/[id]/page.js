
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DetailMotor() {
  const params = useParams();
  const id = params.id;

  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("rettor_user") || "null");
      setRole(user?.role || null);
    } catch {
      setRole(null);
    } finally {
      setRoleLoaded(true);
    }

    if (!id) return;

    async function ambilDetailMotor() {
      try {
        const response = await fetch(`/api/motor/${id}`);
        const data = await response.json();

        if (data.success) {
          setMotor(data.motor);
        } else {
          setMotor(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail motor:", error);
        setMotor(null);
      } finally {
        setLoading(false);
      }
    }

    ambilDetailMotor();
  }, [id]);

  const isAdmin = role === "admin";

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  if (loading || !roleLoaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          background: "#f5f7fb",
        }}
      >
        <h2>Memuat detail motor...</h2>
      </main>
    );
  }

  if (!motor) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          background: "#f5f7fb",
        }}
      >
        <h2>Motor tidak ditemukan</h2>
        <a
          href="/motor"
          style={{
            marginTop: "15px",
            background: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Kembali ke Motor
        </a>
      </main>
    );
  }

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
            padding: "20px 25px",
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
              color: "#2563eb",
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
            <a href="/" style={linkNav}>Beranda</a>
            <a
              href="/motor"
              style={{ ...linkNav, color: "#2563eb", fontWeight: "bold" }}
            >
              Motor
            </a>

            {isAdmin ? (
              <a href="/admin" style={linkNav}>Dashboard Admin</a>
            ) : (
              <>
                <a href="/pesanan" style={linkNav}>Pesanan Saya</a>
                <a href="/profil" style={linkNav}>Profil</a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* DETAIL MOTOR */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px 25px",
        }}
      >
        <a
          href="/motor"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Kembali ke daftar motor
        </a>

        <div
          style={{
            marginTop: "25px",
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* GAMBAR MOTOR */}
          <div
            style={{
              minHeight: "400px",
              background: "#f3f4f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px",
            }}
          >
            {motor.gambar ? (
              <img
                src={motor.gambar}
                alt={motor.nama}
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: "450px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: "100px" }}>🏍️</span>
            )}
          </div>

          {/* INFORMASI MOTOR */}
          <div
            style={{
              padding: "45px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "fit-content",
                background: "#dcfce7",
                color: "#15803d",
                padding: "7px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Tersedia
            </span>

            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "36px",
              }}
            >
              {motor.nama}
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                marginTop: "12px",
              }}
            >
              {motor.jenis} • {motor.cc}cc
            </p>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#eff6ff",
                borderRadius: "12px",
              }}
            >
              <p style={{ margin: 0, color: "#6b7280" }}>
                Harga sewa per hari
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  color: "#2563eb",
                  fontSize: "28px",
                }}
              >
                {formatRupiah(motor.harga)}
              </h2>
            </div>

            {/* TOMBOL SEWA HANYA UNTUK PELANGGAN */}
            {!isAdmin ? (
              <a
                href={`/sewa?motor=${motor.id}`}
                style={{
                  marginTop: "25px",
                  display: "block",
                  textAlign: "center",
                  background: "#2563eb",
                  color: "white",
                  padding: "15px",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
              >
                Sewa Motor Ini
              </a>
            ) : (
              <div
                style={{
                  marginTop: "25px",
                  padding: "15px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "9px",
                  color: "#1e40af",
                  textAlign: "center",
                  fontWeight: "600",
                  lineHeight: "1.6",
                }}
              >
                Anda masuk sebagai Admin. Fitur penyewaan hanya tersedia
                untuk pelanggan.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const linkNav = {
  textDecoration: "none",
  color: "#374151",
  fontWeight: "600",
};
