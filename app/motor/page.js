"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MotorPage() {
  const [motorList, setMotorList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ambilMotor();
  }, []);

  async function ambilMotor() {
    try {
      const response = await fetch("/api/motor");
      const data = await response.json();

      if (data.success) {
        setMotorList(data.motor);
      }
    } catch (error) {
      console.error("Gagal mengambil motor:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0F7FF",
        color: "#111827",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "white",
          padding: "18px 7%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "28px",
            fontWeight: "900",
            color: "#0F4CDB",
            textDecoration: "none",
            letterSpacing: "1px",
          }}
        >
          RETTOR
        </Link>

        <div
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#374151",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Beranda
          </Link>

          <Link
            href="/motor"
            style={{
              color: "#0F4CDB",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Motor
          </Link>

          <Link
            href="/pesanan"
            style={{
              color: "#374151",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Pesanan Saya
          </Link>

          <Link
            href="/profil"
            style={{
              color: "#374151",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Profil
          </Link>

          <Link
            href="/login"
            style={{
              background: "#0F4CDB",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "500px",
          background:
            "linear-gradient(90deg, rgba(15,76,219,0.92) 0%, rgba(15,76,219,0.68) 38%, rgba(15,76,219,0.20) 72%, rgba(15,76,219,0.05) 100%), url('/rettor-motor-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          padding: "70px 7%",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "650px" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "8px 16px",
              borderRadius: "30px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            PILIHAN MOTOR RETTOR
          </div>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 70px)",
              lineHeight: "1.05",
              margin: "0 0 20px",
              fontWeight: "900",
            }}
          >
            Temukan Motor
            <br />
            Terbaik Untukmu
          </h1>

          <p
            style={{
              fontSize: "19px",
              lineHeight: "1.7",
              marginBottom: "30px",
              maxWidth: "560px",
              color: "rgba(255,255,255,0.94)",
            }}
          >
            Pilih motor sesuai kebutuhan perjalananmu. Semua motor RETTOR
            dirawat secara rutin dan siap digunakan untuk menemani perjalanan.
          </p>

          <Link
            href="#daftar-motor"
            style={{
              display: "inline-block",
              background: "white",
              color: "#0F4CDB",
              padding: "14px 25px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "800",
            }}
          >
            Lihat Semua Motor
          </Link>
        </div>
      </section>

      {/* INFO BAR */}
      <section
        style={{
          padding: "25px 7%",
          background: "white",
          boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <strong style={{ color: "#0F4CDB", fontSize: "22px" }}>
              {motorList.length}+
            </strong>
            <p style={{ margin: "4px 0", color: "#4B5563" }}>
              Pilihan Motor
            </p>
          </div>

          <div>
            <strong style={{ color: "#0F4CDB", fontSize: "22px" }}>
              Terawat
            </strong>
            <p style={{ margin: "4px 0", color: "#4B5563" }}>
              Kondisi Motor
            </p>
          </div>

          <div>
            <strong style={{ color: "#0F4CDB", fontSize: "22px" }}>
              Fleksibel
            </strong>
            <p style={{ margin: "4px 0", color: "#4B5563" }}>
              Waktu Penyewaan
            </p>
          </div>

          <div>
            <strong style={{ color: "#0F4CDB", fontSize: "22px" }}>
              Mudah
            </strong>
            <p style={{ margin: "4px 0", color: "#4B5563" }}>
              Proses Pemesanan
            </p>
          </div>
        </div>
      </section>

      {/* DAFTAR MOTOR */}
      <section
        id="daftar-motor"
        style={{
          padding: "75px 7%",
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "45px",
          }}
        >
          <p
            style={{
              color: "#0F4CDB",
              fontWeight: "800",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            KOLEKSI RETTOR
          </p>

          <h2
            style={{
              fontSize: "40px",
              margin: "0 0 12px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            Pilih Motor Favoritmu
          </h2>

          <p
            style={{
              color: "#4B5563",
              fontSize: "17px",
              margin: 0,
            }}
          >
            Berbagai pilihan motor untuk menemani perjalananmu.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#374151",
              fontSize: "18px",
            }}
          >
            Memuat data motor...
          </div>
        ) : motorList.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ color: "#111827" }}>Belum ada motor</h3>

            <p style={{ color: "#6B7280" }}>
              Data motor belum tersedia.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {motorList.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(15,76,219,0.08)",
                  border: "1px solid #E5E7EB",
                }}
              >
                {/* GAMBAR MOTOR */}
                <div
                  style={{
                    height: "240px",
                    background: "#EAF4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {item.gambar ? (
                    item.gambar.startsWith("data:image") ||
                    item.gambar.startsWith("http") ||
                    item.gambar.startsWith("/") ? (
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "90px" }}>
                        {item.gambar}
                      </div>
                    )
                  ) : (
                    <div style={{ fontSize: "90px" }}>🏍️</div>
                  )}
                </div>

                {/* DETAIL */}
                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "23px",
                        color: "#111827",
                        fontWeight: "800",
                      }}
                    >
                      {item.nama}
                    </h3>

                    <span
                      style={{
                        background: "#EAF4FF",
                        color: "#0F4CDB",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {item.jenis}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "8px 0 18px",
                      color: "#6B7280",
                    }}
                  >
                    Mesin {item.cc} CC
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          color: "#6B7280",
                          fontSize: "13px",
                          marginBottom: "3px",
                        }}
                      >
                        Mulai dari
                      </span>

                      <strong
                        style={{
                          color: "#0F4CDB",
                          fontSize: "20px",
                        }}
                      >
                        {formatRupiah(item.harga)}
                      </strong>

                      <span
                        style={{
                          color: "#6B7280",
                          fontSize: "13px",
                        }}
                      >
                        /hari
                      </span>
                    </div>

                    <Link
                      href={`/motor/${item.id}`}
                      style={{
                        background: "#0F4CDB",
                        color: "white",
                        padding: "11px 16px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CARA SEWA */}
      <section
        style={{
          background: "white",
          padding: "75px 7%",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "45px",
            }}
          >
            <p
              style={{
                color: "#0F4CDB",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              CARA PENYEWAAN
            </p>

            <h2
              style={{
                fontSize: "38px",
                margin: 0,
                fontWeight: "900",
                color: "#111827",
              }}
            >
              Sewa Motor dengan Mudah
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "25px",
            }}
          >
            {[
              {
                nomor: "01",
                judul: "Pilih Motor",
                isi: "Pilih motor yang sesuai dengan kebutuhan perjalananmu.",
              },
              {
                nomor: "02",
                judul: "Isi Data",
                isi: "Masukkan data penyewaan dan tanggal penggunaan motor.",
              },
              {
                nomor: "03",
                judul: "Ajukan Pesanan",
                isi: "Kirim pesanan dan tunggu konfirmasi dari admin.",
              },
              {
                nomor: "04",
                judul: "Motor Siap",
                isi: "Setelah disetujui, motor siap digunakan.",
              },
            ].map((step) => (
              <div
                key={step.nomor}
                style={{
                  padding: "28px",
                  background: "#F0F7FF",
                  borderRadius: "18px",
                  border: "1px solid #DCEBFF",
                }}
              >
                <div
                  style={{
                    color: "#0F4CDB",
                    fontSize: "15px",
                    fontWeight: "900",
                    marginBottom: "15px",
                  }}
                >
                  {step.nomor}
                </div>

                <h3
                  style={{
                    color: "#111827",
                    margin: "0 0 10px",
                    fontSize: "20px",
                  }}
                >
                  {step.judul}
                </h3>

                <p
                  style={{
                    color: "#4B5563",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {step.isi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "70px 7%",
          background: "linear-gradient(135deg, #0F4CDB, #1677FF)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "40px",
            margin: "0 0 15px",
            fontWeight: "900",
          }}
        >
          Siap Memulai Perjalanan?
        </h2>

        <p
          style={{
            fontSize: "18px",
            margin: "0 auto 28px",
            maxWidth: "650px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Pilih motor favoritmu dan lakukan pemesanan dengan mudah melalui
          RETTOR.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "white",
            color: "#0F4CDB",
            padding: "14px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "800",
          }}
        >
          Kembali ke Beranda
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0B1F3A",
          color: "white",
          padding: "50px 7% 25px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "35px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "28px",
                fontWeight: "900",
              }}
            >
              RETTOR
            </h2>

            <p
              style={{
                color: "#CBD5E1",
                lineHeight: "1.7",
              }}
            >
              Rental motor terpercaya untuk perjalanan yang lebih mudah,
              nyaman, dan praktis.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: "15px" }}>
              Navigasi
            </h3>

            <Link
              href="/"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
                marginBottom: "10px",
              }}
            >
              Beranda
            </Link>

            <Link
              href="/motor"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
                marginBottom: "10px",
              }}
            >
              Motor
            </Link>

            <Link
              href="/login"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </div>

          <div>
            <h3 style={{ marginBottom: "15px" }}>
              Layanan
            </h3>

            <p
              style={{
                color: "#CBD5E1",
                margin: "0 0 10px",
              }}
            >
              Rental Motor
            </p>

            <p
              style={{
                color: "#CBD5E1",
                margin: "0 0 10px",
              }}
            >
              Pemesanan Online
            </p>

            <p
              style={{
                color: "#CBD5E1",
                margin: 0,
              }}
            >
              Konfirmasi Admin
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "35px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "14px",
          }}
        >
          © 2026 RETTOR Rental Motor. All rights reserved.
        </div>
      </footer>
    </main>
  );
}