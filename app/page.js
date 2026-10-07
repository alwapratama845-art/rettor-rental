"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [motorList, setMotorList] = useState([]);
  const [user, setUser] = useState(null);

  // ================= AMBIL DATA =================
  useEffect(() => {
    const dataUser = localStorage.getItem("rettor_user");

    if (dataUser) {
      try {
        setUser(JSON.parse(dataUser));
      } catch (error) {
        console.error("USER ERROR:", error);
      }
    }

    const ambilMotor = async () => {
      try {
        const response = await fetch("/api/motor");
        const data = await response.json();

        if (data.success) {
          setMotorList(data.motor);
        }
      } catch (error) {
        console.error("Gagal mengambil motor:", error);
      }
    };

    ambilMotor();
  }, []);

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0F7FF",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 100,
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
          {/* LOGO */}
          <a
            href="/"
            style={{
              textDecoration: "none",
              fontSize: "28px",
              fontWeight: "900",
              color: "#2563eb",
              letterSpacing: "-1px",
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
              href="/"
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

            {user ? (
              <>
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
                  onClick={() => {
                    localStorage.removeItem("rettor_user");
                    window.location.href = "/";
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#dc2626",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Login
                </a>

                <a
                  href="/register"
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "11px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Daftar
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        style={{
          minHeight: "570px",
          background:
            "linear-gradient(90deg, rgba(15,76,219,0.94) 0%, rgba(15,76,219,0.78) 35%, rgba(15,76,219,0.28) 70%, rgba(15,76,219,0.12) 100%), url('/rettor-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "70px 25px 110px",
            boxSizing: "border-box",
          }}
        >
          {/* HERO CONTENT */}
          <div
            style={{
              maxWidth: "650px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "9px 16px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "20px",
                backdropFilter: "blur(5px)",
              }}
            >
              🏍️ RENTAL MOTOR TERPERCAYA
            </div>

            <h1
              style={{
                fontSize: "54px",
                lineHeight: "1.08",
                margin: "0 0 20px",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              Perjalanan Lebih Mudah,
              <br />
              <span style={{ color: "#bfdbfe" }}>
                Motor Siap Jalan.
              </span>
            </h1>

            <p
              style={{
                fontSize: "19px",
                lineHeight: "1.7",
                color: "#eff6ff",
                maxWidth: "600px",
                margin: "0 0 30px",
              }}
            >
              Sewa motor pilihanmu dengan mudah, cepat, dan
              nyaman. Pilih motor, tentukan tanggal, lalu
              tunggu konfirmasi dari RETTOR RENTAL.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/motor"
                style={{
                  background: "white",
                  color: "#2563eb",
                  padding: "15px 27px",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
                }}
              >
                🏍️ Lihat Motor
              </a>

              <a
                href={user ? "/pesanan" : "/login"}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.6)",
                  padding: "15px 27px",
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  backdropFilter: "blur(5px)",
                }}
              >
                Cek Pesanan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOOKING BAR ================= */}
      <section
        style={{
          maxWidth: "1050px",
          margin: "-45px auto 0",
          padding: "0 25px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            alignItems: "end",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "13px",
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              PILIH MOTOR
            </p>

            <strong style={{ color: "#111827" }}>
              Berbagai pilihan motor
            </strong>
          </div>

          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "13px",
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              HARGA
            </p>

            <strong style={{ color: "#111827" }}>
              Mulai dari Rp70.000/hari
            </strong>
          </div>

          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "13px",
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              PROSES
            </p>

            <strong style={{ color: "#111827" }}>
              Mudah & cepat
            </strong>
          </div>

          <a
            href="/motor"
            style={{
              textAlign: "center",
              background: "#2563eb",
              color: "white",
              padding: "14px 20px",
              borderRadius: "9px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Mulai Sewa →
          </a>
        </div>
      </section>

      {/* ================= MOTOR POPULER ================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "30px",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "#2563eb",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              PILIHAN MOTOR
            </p>

            <h2
              style={{
                fontSize: "34px",
                margin: "8px 0 0",
                color: "#111827",
              }}
            >
              Motor Favorit Kami
            </h2>

            <p
              style={{
                color: "#4b5563",
                marginTop: "8px",
              }}
            >
              Pilih kendaraan yang sesuai dengan kebutuhanmu.
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          {motorList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
                border: "1px solid #dbeafe",
              }}
            >
              <div
                style={{
                  height: "220px",
                  background: "#eff6ff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "15px",
                }}
              >
                {item.gambar ? (
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "80px" }}>
                    🏍️
                  </span>
                )}
              </div>

              <div style={{ padding: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "20px",
                    }}
                  >
                    {item.nama}
                  </h3>

                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "5px 9px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      height: "fit-content",
                    }}
                  >
                    Tersedia
                  </span>
                </div>

                <p
                  style={{
                    color: "#4b5563",
                    margin: "8px 0 18px",
                  }}
                >
                  {item.jenis} • {item.cc}cc
                </p>

                <strong
                  style={{
                    color: "#2563eb",
                    fontSize: "19px",
                  }}
                >
                  {formatRupiah(item.harga)}

                  <span
                    style={{
                      color: "#4b5563",
                      fontSize: "13px",
                      fontWeight: "normal",
                    }}
                  >
                    {" "}
                    / hari
                  </span>
                </strong>

                <a
                  href={`/motor/${item.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "18px",
                    background: "#eff6ff",
                    color: "#2563eb",
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
      </section>

      {/* ================= KEUNGGULAN ================= */}
      <section
        style={{
          background: "white",
          padding: "75px 25px",
          borderTop: "1px solid #dbeafe",
          borderBottom: "1px solid #dbeafe",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            KENAPA RETTOR?
          </p>

          <h2
            style={{
              fontSize: "34px",
              margin: "8px 0 40px",
              color: "#111827",
            }}
          >
            Rental Motor Tanpa Ribet
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "25px",
            }}
          >
            <div
              style={{
                padding: "30px 20px",
                border: "1px solid #dbeafe",
                borderRadius: "15px",
              }}
            >
              <div style={{ fontSize: "40px" }}>⚡</div>

              <h3 style={{ color: "#111827" }}>
                Mudah & Cepat
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.6",
                }}
              >
                Proses penyewaan dibuat sederhana agar kamu
                tidak perlu ribet.
              </p>
            </div>

            <div
              style={{
                padding: "30px 20px",
                border: "1px solid #dbeafe",
                borderRadius: "15px",
              }}
            >
              <div style={{ fontSize: "40px" }}>💰</div>

              <h3 style={{ color: "#111827" }}>
                Harga Terjangkau
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.6",
                }}
              >
                Pilihan motor dengan harga sewa yang sesuai
                untuk berbagai kebutuhan.
              </p>
            </div>

            <div
              style={{
                padding: "30px 20px",
                border: "1px solid #dbeafe",
                borderRadius: "15px",
              }}
            >
              <div style={{ fontSize: "40px" }}>🛵</div>

              <h3 style={{ color: "#111827" }}>
                Banyak Pilihan
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.6",
                }}
              >
                Pilih motor sesuai kebutuhan perjalanan kamu.
              </p>
            </div>

            <div
              style={{
                padding: "30px 20px",
                border: "1px solid #dbeafe",
                borderRadius: "15px",
              }}
            >
              <div style={{ fontSize: "40px" }}>🔒</div>

              <h3 style={{ color: "#111827" }}>
                Proses Teratur
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  lineHeight: "1.6",
                }}
              >
                Setiap penyewaan dicatat dan menunggu
                konfirmasi dari admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CARA SEWA ================= */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "80px 25px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            CARA SEWA
          </p>

          <h2
            style={{
              fontSize: "34px",
              margin: "8px 0 45px",
              color: "#111827",
            }}
          >
            Sewa Motor Dalam 3 Langkah
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "55px",
                height: "55px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              1
            </div>

            <h3 style={{ color: "#111827" }}>
              Pilih Motor
            </h3>

            <p style={{ color: "#4b5563" }}>
              Pilih motor yang sesuai dengan kebutuhanmu.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "55px",
                height: "55px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              2
            </div>

            <h3 style={{ color: "#111827" }}>
              Isi Form Sewa
            </h3>

            <p style={{ color: "#4b5563" }}>
              Tentukan tanggal dan lengkapi data penyewaan.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "55px",
                height: "55px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#2563eb",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              3
            </div>

            <h3 style={{ color: "#111827" }}>
              Tunggu Konfirmasi
            </h3>

            <p style={{ color: "#4b5563" }}>
              Admin akan memproses dan mengonfirmasi pesananmu.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        style={{
          maxWidth: "1150px",
          margin: "0 auto 70px",
          padding: "0 25px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #1d4ed8, #2563eb)",
            color: "white",
            borderRadius: "22px",
            padding: "55px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "34px",
              margin: "0 0 12px",
            }}
          >
            Siap Memulai Perjalanan?
          </h2>

          <p
            style={{
              color: "#dbeafe",
              fontSize: "17px",
              marginBottom: "25px",
            }}
          >
            Pilih motor favoritmu dan lakukan penyewaan
            sekarang.
          </p>

          <a
            href="/motor"
            style={{
              display: "inline-block",
              background: "white",
              color: "#2563eb",
              padding: "14px 28px",
              borderRadius: "9px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Mulai Sewa Sekarang
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "#111827",
          color: "white",
          padding: "45px 25px 25px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#60a5fa",
              }}
            >
              RETTOR
            </h2>

            <p
              style={{
                color: "#9ca3af",
                lineHeight: "1.7",
              }}
            >
              RETTOR RENTAL adalah layanan penyewaan motor
              untuk menemani perjalananmu dengan mudah dan
              nyaman.
            </p>
          </div>

          <div>
            <h3>Menu</h3>

            <p>
              <a
                href="/"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                }}
              >
                Beranda
              </a>
            </p>

            <p>
              <a
                href="/motor"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                }}
              >
                Daftar Motor
              </a>
            </p>

            <p>
              <a
                href="/login"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                }}
              >
                Login
              </a>
            </p>
          </div>

          <div>
            <h3>Layanan</h3>

            <p style={{ color: "#9ca3af" }}>
              Rental Motor
            </p>

            <p style={{ color: "#9ca3af" }}>
              Pemesanan Online
            </p>

            <p style={{ color: "#9ca3af" }}>
              Konfirmasi Pesanan
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1100px",
            margin: "35px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          © 2026 RETTOR RENTAL. All rights reserved.
        </div>
      </footer>
    </main>
  );
}