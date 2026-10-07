"use client";

import { useEffect, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data user yang login
    const dataUser = localStorage.getItem("rettor_user");

    if (!dataUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(dataUser));

    // Ambil motor dari PostgreSQL
    ambilMotor();
  }, []);

  async function ambilMotor() {
    try {
      const response = await fetch("/api/motor");
      const data = await response.json();

      if (response.ok) {
        setMotor(data.motor || []);
      }
    } catch (error) {
      console.error("GAGAL AMBIL MOTOR:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatRupiah(angka) {
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
  }

  function logout() {
    localStorage.removeItem("rettor_user");
    window.location.href = "/login";
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Memuat...
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

      {/* ================= NAVBAR ================= */}
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
            gap: "20px",
          }}
        >

          {/* LOGO */}
          <a
            href="/user"
            style={{
              textDecoration: "none",
              fontSize: "28px",
              fontWeight: "900",
              color: "#2563eb",
            }}
          >
            RETTOR
          </a>

          {/* MENU */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
            }}
          >
            <a
              href="/user"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Beranda
            </a>

            <a
              href="/motor"
              style={{
                color: "#374151",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Motor
            </a>

            <a
              href="/pesanan"
              style={{
                color: "#374151",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Pesanan Saya
            </a>

            <a
              href="/profil"
              style={{
                color: "#374151",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Profil
            </a>

            <button
              onClick={logout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #60a5fa 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "70px 25px",
            display: "grid",
            gridTemplateColumns: "1.3fr 0.7fr",
            gap: "40px",
            alignItems: "center",
          }}
        >

          <div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
                opacity: 0.9,
              }}
            >
              SELAMAT DATANG DI RETTOR RENTAL
            </p>

            <h1
              style={{
                fontSize: "48px",
                lineHeight: "1.1",
                margin: "0 0 18px",
                fontWeight: "900",
              }}
            >
              Halo, {user.nama} 👋
            </h1>

            <p
              style={{
                fontSize: "19px",
                lineHeight: "1.6",
                maxWidth: "650px",
                marginBottom: "28px",
              }}
            >
              Mau jalan-jalan, kuliah, kerja, atau keliling kota?
              Sewa motor pilihanmu dengan mudah di RETTOR RENTAL.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/motor"
                style={{
                  background: "white",
                  color: "#2563eb",
                  padding: "14px 25px",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                🏍️ Lihat Motor
              </a>

              <a
                href="/pesanan"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  padding: "14px 25px",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              >
                📋 Pesanan Saya
              </a>
            </div>
          </div>


          {/* HERO CARD */}
          <div
            style={{
              background: "rgba(255,255,255,0.13)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "20px",
              padding: "30px",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                marginBottom: "15px",
              }}
            >
              🏍️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "25px",
              }}
            >
              Rental Motor Mudah
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              Pilih motor, tentukan tanggal sewa, dan ajukan
              pesanan hanya dalam beberapa langkah.
            </p>
          </div>

        </div>
      </section>


      {/* ================= KEUNGGULAN ================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "45px 25px 20px",
        }}
      >

        <h2
          style={{
            color: "#111827",
            marginBottom: "8px",
            fontSize: "28px",
          }}
        >
          Kenapa RETTOR?
        </h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "25px",
          }}
        >
          Rental motor praktis untuk kebutuhan perjalananmu.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >

          <Feature
            icon="🏍️"
            title="Motor Berkualitas"
            text="Pilihan motor terawat dan siap digunakan."
          />

          <Feature
            icon="💰"
            title="Harga Terjangkau"
            text="Harga sewa jelas dan sesuai kebutuhan."
          />

          <Feature
            icon="⚡"
            title="Proses Mudah"
            text="Pesan motor dengan proses yang cepat dan sederhana."
          />

          <Feature
            icon="🔒"
            title="Aman & Terpercaya"
            text="Data pesanan tersimpan dengan baik."
          />

        </div>

      </section>


      {/* ================= MOTOR ================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 25px 70px",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            gap: "15px",
          }}
        >

          <div>
            <h2
              style={{
                color: "#111827",
                margin: "0 0 6px",
                fontSize: "28px",
              }}
            >
              Motor Pilihan
            </h2>

            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Pilih motor yang sesuai dengan kebutuhanmu.
            </p>
          </div>

          <a
            href="/motor"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Lihat Semua →
          </a>

        </div>


        {/* MOTOR */}
        {loading ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Memuat motor...
          </div>
        ) : motor.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Belum ada motor tersedia.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >

            {motor.slice(0, 6).map((item) => (

              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                }}
              >

                {/* FOTO */}
                <div
                  style={{
                    height: "210px",
                    background: "#f8fafc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "65px",
                      }}
                    >
                      🏍️
                    </div>
                  )}
                </div>


                {/* DETAIL */}
                <div
                  style={{
                    padding: "20px",
                  }}
                >

                  <h3
                    style={{
                      margin: "0 0 10px",
                      color: "#111827",
                      fontSize: "20px",
                    }}
                  >
                    {item.nama}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    <span style={badgeStyle}>
                      {item.jenis}
                    </span>

                    <span style={badgeStyle}>
                      {item.cc}cc
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#2563eb",
                      fontWeight: "900",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    {formatRupiah(item.harga)}
                    <span
                      style={{
                        color: "#6b7280",
                        fontWeight: "normal",
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      / hari
                    </span>
                  </div>

                  <a
                    href={`/motor/${item.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#2563eb",
                      color: "white",
                      padding: "12px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Lihat Detail
                  </a>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "#111827",
          color: "white",
          padding: "35px 25px",
        }}
      >

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "900",
              }}
            >
              RETTOR
            </div>

            <div
              style={{
                color: "#9ca3af",
                marginTop: "6px",
              }}
            >
              Rental Motor Mudah & Terpercaya
            </div>
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            © 2026 RETTOR RENTAL
          </div>

        </div>

      </footer>

    </main>
  );
}


// ==============================
// FEATURE COMPONENT
// ==============================

function Feature({ icon, title, text }) {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "13px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#111827",
          margin: "0 0 8px",
          fontSize: "18px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#6b7280",
          margin: 0,
          lineHeight: "1.5",
        }}
      >
        {text}
      </p>
    </div>
  );
}


// ==============================
// BADGE
// ==============================

const badgeStyle = {
  background: "#eff6ff",
  color: "#2563eb",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};