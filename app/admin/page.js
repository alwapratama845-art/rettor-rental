"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  async function ambilPesanan() {
    try {
      const response = await fetch("/api/pesanan");
      const data = await response.json();

      if (response.ok) {
        setPesanan(data.pesanan || []);
      } else {
        alert(data.message || "Gagal mengambil data pesanan.");
      }
    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilPesanan();
  }, []);

  async function ubahStatus(id, status) {
    try {
      const response = await fetch("/api/pesanan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengubah status.");
        return;
      }

      alert(data.message);
      ambilPesanan();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    }
  }

  function formatRupiah(angka) {
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "32px",
            }}
          >
            RETTOR ADMIN
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          >
            Dashboard Admin RETTOR RENTAL
          </p>

          {/* MENU ADMIN */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <a
              href="/admin"
              style={{
                background: "#16a34a",
                color: "white",
                padding: "12px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              📋 Kelola Pesanan
            </a>

            <a
              href="/admin/motor"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "12px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              🏍️ Kelola Motor
            </a>

            <a
              href="/admin/motor"
              style={{
                background: "#7c3aed",
                color: "white",
                padding: "12px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ➕ Tambah Motor
            </a>

            <a
              href="/"
              style={{
                background: "#111827",
                color: "white",
                padding: "12px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              🏠 Website
            </a>
          </div>
        </div>

        {/* JUDUL PESANAN */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#111827",
              marginBottom: "5px",
            }}
          >
            📋 Kelola Pesanan
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Konfirmasi atau tolak pesanan pelanggan.
          </p>
        </div>

        {/* DATA PESANAN */}
        {loading ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#666",
            }}
          >
            Memuat data pesanan...
          </div>
        ) : pesanan.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#666",
            }}
          >
            Belum ada pesanan.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {pesanan.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                }}
              >

                {/* PESANAN HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    gap: "10px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    Pesanan #{item.id}
                  </h2>

                  <span
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      background:
                        item.status === "disetujui"
                          ? "#dcfce7"
                          : item.status === "ditolak"
                          ? "#fee2e2"
                          : "#fef3c7",
                      color:
                        item.status === "disetujui"
                          ? "#166534"
                          : item.status === "ditolak"
                          ? "#991b1b"
                          : "#92400e",
                      fontWeight: "bold",
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
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <Info label="Nama" value={item.nama} />
                  <Info label="Nomor HP" value={item.telepon} />
                  <Info label="Motor" value={item.motor} />

                  <Info
                    label="Harga / Hari"
                    value={formatRupiah(item.harga_per_hari)}
                  />

                  <Info
                    label="Tanggal Mulai"
                    value={item.tanggal_mulai}
                  />

                  <Info
                    label="Tanggal Selesai"
                    value={item.tanggal_selesai}
                  />

                  <Info
                    label="Tanggal Kembali"
                    value={item.tanggal_kembali}
                  />

                  <Info
                    label="Lama Sewa"
                    value={`${item.jumlah_hari} hari`}
                  />

                  <Info
                    label="Diskon"
                    value={`${item.persen_diskon}%`}
                  />

                  <Info
                    label="Potongan"
                    value={formatRupiah(item.jumlah_diskon)}
                  />

                  <Info
                    label="Keterlambatan"
                    value={`${item.hari_terlambat} hari`}
                  />

                  <Info
                    label="Denda"
                    value={formatRupiah(item.denda)}
                  />
                </div>

                {/* TOTAL */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                  }}
                >
                  <strong style={{ color: "#111827" }}>
                    Total Harga:
                  </strong>

                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#2563eb",
                    }}
                  >
                    {formatRupiah(item.total_harga)}
                  </span>
                </div>

                {/* TOMBOL */}
                {item.status === "menunggu" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        ubahStatus(item.id, "disetujui")
                      }
                      style={{
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✓ Konfirmasi
                    </button>

                    <button
                      onClick={() =>
                        ubahStatus(item.id, "ditolak")
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✕ Tolak
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}