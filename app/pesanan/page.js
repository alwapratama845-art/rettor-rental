"use client";

import { useEffect, useState } from "react";

export default function PesananPage() {
  const [user, setUser] = useState(null);
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataUser = localStorage.getItem("rettor_user");

    if (!dataUser) {
      window.location.href = "/login";
      return;
    }

    const userData = JSON.parse(dataUser);
    setUser(userData);

    ambilPesanan(userData.id);
  }, []);

  const ambilPesanan = async (userId) => {
    try {
      const response = await fetch(
        `/api/pesanan?user_id=${userId}`
      );

      const data = await response.json();

      if (data.success) {
        setPesanan(data.pesanan);
      }
    } catch (error) {
      console.error("Gagal mengambil pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const warnaStatus = (status) => {
    if (status === "disetujui") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "ditolak") {
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    }

    return {
      background: "#fef3c7",
      color: "#b45309",
    };
  };

  if (loading || !user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F0F7FF",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ color: "#111827" }}>
          Memuat pesanan...
        </h2>
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
            gap: "20px",
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
              justifyContent: "center",
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
                color: "#0F4CDB",
                fontWeight: "700",
              }}
            >
              Pesanan Saya
            </a>

            <a
              href="/profil"
              style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Profil
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "360px",
          background:
            "linear-gradient(90deg, rgba(15,76,219,0.96) 0%, rgba(15,76,219,0.82) 38%, rgba(15,76,219,0.45) 70%, rgba(15,76,219,0.20) 100%), url('/rettor-pesanan-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          padding: "60px 7%",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "650px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "30px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "18px",
              letterSpacing: "1px",
            }}
          >
            RETTOR RENTAL MOTOR
          </div>

          <h1
            style={{
              margin: "0 0 15px",
              fontSize: "clamp(40px, 6vw, 60px)",
              lineHeight: "1.05",
              fontWeight: "900",
            }}
          >
            Pesanan Saya
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Halo, {user.nama}. Pantau semua riwayat penyewaan
            motor kamu di sini.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "55px 25px 80px",
        }}
      >
        {/* JUDUL */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              margin: "0 0 7px",
              color: "#0F4CDB",
              fontWeight: "800",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            RIWAYAT PENYEWAAN
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "900",
              color: "#111827",
            }}
          >
            Daftar Pesanan
          </h2>
        </div>

        {pesanan.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "60px 30px",
              borderRadius: "22px",
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(15,76,219,0.08)",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px",
                borderRadius: "50%",
                background: "#EAF4FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0F4CDB",
                fontSize: "35px",
                fontWeight: "900",
              }}
            >
              0
            </div>

            <h2
              style={{
                color: "#111827",
                margin: "0 0 10px",
              }}
            >
              Belum ada pesanan
            </h2>

            <p
              style={{
                color: "#6B7280",
                margin: "0 0 20px",
              }}
            >
              Kamu belum melakukan penyewaan motor.
            </p>

            <a
              href="/motor"
              style={{
                display: "inline-block",
                background: "#0F4CDB",
                color: "white",
                padding: "13px 25px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Pilih Motor
            </a>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "25px",
            }}
          >
            {pesanan.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "0 8px 30px rgba(15,76,219,0.08)",
                  border: "1px solid #E5E7EB",
                }}
              >
                {/* HEADER PESANAN */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "25px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#6B7280",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      NOMOR PESANAN
                    </p>

                    <h2
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: "25px",
                        fontWeight: "900",
                      }}
                    >
                      {item.motor}
                    </h2>

                    <p
                      style={{
                        margin: "7px 0 0",
                        color: "#6B7280",
                      }}
                    >
                      Pesanan #{item.id}
                    </p>
                  </div>

                  <span
                    style={{
                      ...warnaStatus(item.status),
                      padding: "9px 16px",
                      borderRadius: "25px",
                      fontWeight: "700",
                      fontSize: "13px",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {/* DETAIL */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    background: "#F8FBFF",
                    padding: "22px",
                    borderRadius: "15px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#6B7280",
                        margin: "0 0 6px",
                        fontSize: "14px",
                      }}
                    >
                      Tanggal Mulai
                    </p>

                    <strong
                      style={{
                        color: "#111827",
                      }}
                    >
                      {formatTanggal(item.tanggal_mulai)}
                    </strong>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#6B7280",
                        margin: "0 0 6px",
                        fontSize: "14px",
                      }}
                    >
                      Tanggal Selesai
                    </p>

                    <strong
                      style={{
                        color: "#111827",
                      }}
                    >
                      {formatTanggal(item.tanggal_selesai)}
                    </strong>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#6B7280",
                        margin: "0 0 6px",
                        fontSize: "14px",
                      }}
                    >
                      Jumlah Hari
                    </p>

                    <strong
                      style={{
                        color: "#111827",
                      }}
                    >
                      {item.jumlah_hari} hari
                    </strong>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#6B7280",
                        margin: "0 0 6px",
                        fontSize: "14px",
                      }}
                    >
                      Total Harga
                    </p>

                    <strong
                      style={{
                        color: "#0F4CDB",
                        fontSize: "19px",
                      }}
                    >
                      {formatRupiah(item.total_harga)}
                    </strong>
                  </div>
                </div>

                {/* PENGEMBALIAN */}
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #E5E7EB",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#6B7280",
                        fontSize: "14px",
                      }}
                    >
                      Tanggal Pengembalian
                    </p>

                    <strong
                      style={{
                        color: "#111827",
                      }}
                    >
                      {formatTanggal(item.tanggal_kembali)}
                    </strong>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#6B7280",
                        fontSize: "14px",
                      }}
                    >
                      Status Pesanan
                    </p>

                    <strong
                      style={{
                        color:
                          item.status === "disetujui"
                            ? "#15803d"
                            : item.status === "ditolak"
                            ? "#dc2626"
                            : "#b45309",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.status}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0B1F3A",
          color: "white",
          padding: "45px 7% 25px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
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
                margin: 0,
                color: "#CBD5E1",
                lineHeight: "1.7",
              }}
            >
              Rental motor terpercaya untuk perjalanan yang
              lebih mudah, nyaman, dan praktis.
            </p>
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 15px",
              }}
            >
              Navigasi
            </h3>

            <a
              href="/"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
                marginBottom: "10px",
              }}
            >
              Beranda
            </a>

            <a
              href="/motor"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
                marginBottom: "10px",
              }}
            >
              Motor
            </a>

            <a
              href="/pesanan"
              style={{
                display: "block",
                color: "#CBD5E1",
                textDecoration: "none",
              }}
            >
              Pesanan Saya
            </a>
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 15px",
              }}
            >
              Layanan
            </h3>

            <p
              style={{
                margin: "0 0 10px",
                color: "#CBD5E1",
              }}
            >
              Rental Motor
            </p>

            <p
              style={{
                margin: "0 0 10px",
                color: "#CBD5E1",
              }}
            >
              Pemesanan Online
            </p>

            <p
              style={{
                margin: 0,
                color: "#CBD5E1",
              }}
            >
              Konfirmasi Admin
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1100px",
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