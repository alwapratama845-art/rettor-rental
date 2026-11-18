
"use client";

import { useEffect, useState } from "react";

const DEPOSIT_TETAP = 200000;

export default function AdminPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proses, setProses] = useState(null);

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
    if (proses !== null) return;

    const konfirmasi =
      status === "disetujui"
        ? "Apakah kamu yakin ingin menyetujui pesanan ini?"
        : "Apakah kamu yakin ingin menolak pesanan ini?";

    if (!window.confirm(konfirmasi)) return;

    try {
      setProses(id);

      const response = await fetch("/api/pesanan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengubah status.");
        return;
      }

      alert(data.message);
      await ambilPesanan();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    } finally {
      setProses(null);
    }
  }

  async function ubahStatusDeposit(id, status_deposit, catatan = null) {
    if (proses !== null) return;

    let pesan = "";

    if (status_deposit === "diterima") {
      pesan = "Pastikan uang deposit Rp200.000 sudah diterima. Lanjutkan?";
    } else if (status_deposit === "dikembalikan") {
      pesan = "Pastikan motor sudah diperiksa dan deposit akan dikembalikan. Lanjutkan?";
    } else if (status_deposit === "dipotong") {
      pesan = "Deposit akan ditandai sebagai dipotong sesuai catatan. Lanjutkan?";
    }

    if (!window.confirm(pesan)) return;

    try {
      setProses(id);

      const response = await fetch("/api/pesanan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status_deposit,
          catatan_deposit: catatan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengubah deposit.");
        return;
      }

      alert(data.message);
      await ambilPesanan();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    } finally {
      setProses(null);
    }
  }

  function potongDeposit(id) {
    const alasan = window.prompt(
      "Masukkan alasan pemotongan deposit, misalnya biaya kerusakan motor:"
    );

    if (alasan === null) return;

    if (!alasan.trim()) {
      alert("Alasan pemotongan wajib diisi.");
      return;
    }

    ubahStatusDeposit(id, "dipotong", alasan.trim());
  }

  function formatRupiah(angka) {
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
  }

  function warnaStatus(status) {
    if (status === "disetujui") {
      return { background: "#dcfce7", color: "#166534" };
    }

    if (status === "ditolak") {
      return { background: "#fee2e2", color: "#991b1b" };
    }

    return { background: "#fef3c7", color: "#92400e" };
  }

  function warnaDeposit(status) {
    if (status === "diterima") {
      return { background: "#dbeafe", color: "#1d4ed8" };
    }

    if (status === "dikembalikan") {
      return { background: "#dcfce7", color: "#166534" };
    }

    if (status === "dipotong") {
      return { background: "#fee2e2", color: "#991b1b" };
    }

    return { background: "#fef3c7", color: "#92400e" };
  }

  function labelDeposit(status) {
    const labels = {
      menunggu: "Menunggu",
      diterima: "Sudah Diterima",
      dikembalikan: "Sudah Dikembalikan",
      dipotong: "Deposit Dipotong",
    };

    return labels[status] || "Menunggu";
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
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#111827", marginBottom: "5px" }}>
            📋 Kelola Pesanan
          </h2>

          <p style={{ color: "#6b7280" }}>
            Konfirmasi pesanan dan kelola uang deposit pelanggan.
          </p>
        </div>

        {/* DATA PESANAN */}
        {loading ? (
          <div style={kotakKosong}>
            Memuat data pesanan...
          </div>
        ) : pesanan.length === 0 ? (
          <div style={kotakKosong}>
            Belum ada pesanan.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {pesanan.map((item) => {
              const statusDeposit = item.status_deposit || "menunggu";
              const jumlahDeposit = Number(
                item.jumlah_deposit ?? DEPOSIT_TETAP
              );

              return (
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
                      flexWrap: "wrap",
                      marginBottom: "20px",
                      gap: "10px",
                    }}
                  >
                    <h2 style={{ margin: 0, color: "#111827" }}>
                      Pesanan #{item.id}
                    </h2>

                    <span
                      style={{
                        padding: "7px 14px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        ...warnaStatus(item.status),
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* DETAIL PESANAN */}
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

                    <Info label="Tanggal Mulai" value={item.tanggal_mulai} />
                    <Info label="Tanggal Selesai" value={item.tanggal_selesai} />
                    <Info label="Tanggal Kembali" value={item.tanggal_kembali} />

                    <Info
                      label="Lama Sewa"
                      value={`${item.jumlah_hari || 0} hari`}
                    />

                    <Info
                      label="Diskon"
                      value={`${item.persen_diskon || 0}%`}
                    />

                    <Info
                      label="Potongan Harga"
                      value={formatRupiah(item.jumlah_diskon)}
                    />

                    <Info
                      label="Keterlambatan"
                      value={`${item.hari_terlambat || 0} hari`}
                    />

                    <Info label="Denda" value={formatRupiah(item.denda)} />
                  </div>

                  {/* TOTAL HARGA SEWA */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      background: "#f3f4f6",
                      borderRadius: "8px",
                    }}
                  >
                    <strong style={{ color: "#111827" }}>
                      Total Harga Sewa:
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

                  {/* PENGELOLAAN DEPOSIT */}
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#1e3a8a",
                          fontSize: "19px",
                        }}
                      >
                        💰 Deposit Jaminan
                      </h3>

                      <span
                        style={{
                          padding: "7px 13px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          ...warnaDeposit(statusDeposit),
                        }}
                      >
                        {labelDeposit(statusDeposit)}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#1e40af",
                        fontSize: "22px",
                        fontWeight: "bold",
                        margin: "12px 0",
                      }}
                    >
                      {formatRupiah(jumlahDeposit)}
                    </p>

                    <p style={{ color: "#374151", margin: "5px 0" }}>
                      Deposit tetap yang menjadi jaminan selama penyewaan.
                    </p>

                    {item.catatan_deposit && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          background: "white",
                          borderRadius: "7px",
                          color: "#374151",
                        }}
                      >
                        <strong>Catatan Admin:</strong>
                        <p style={{ margin: "6px 0 0" }}>
                          {item.catatan_deposit}
                        </p>
                      </div>
                    )}

                    {/* TOMBOL DEPOSIT */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "18px",
                      }}
                    >
                      {statusDeposit === "menunggu" && (
                        <button
                          disabled={proses !== null}
                          onClick={() =>
                            ubahStatusDeposit(item.id, "diterima")
                          }
                          style={tombol("#2563eb", proses === item.id)}
                        >
                          ✓ Terima Deposit
                        </button>
                      )}

                      {statusDeposit === "diterima" && (
                        <>
                          <button
                            disabled={proses !== null}
                            onClick={() =>
                              ubahStatusDeposit(item.id, "dikembalikan")
                            }
                            style={tombol("#16a34a", proses === item.id)}
                          >
                            ↩ Kembalikan Deposit
                          </button>

                          <button
                            disabled={proses !== null}
                            onClick={() => potongDeposit(item.id)}
                            style={tombol("#dc2626", proses === item.id)}
                          >
                            ✕ Potong Deposit
                          </button>
                        </>
                      )}

                      {statusDeposit === "dikembalikan" && (
                        <p style={{ color: "#166534", fontWeight: "bold" }}>
                          ✓ Deposit sudah dikembalikan kepada pelanggan.
                        </p>
                      )}

                      {statusDeposit === "dipotong" && (
                        <p style={{ color: "#991b1b", fontWeight: "bold" }}>
                          Deposit sudah ditandai dipotong.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* TOMBOL STATUS PESANAN */}
                  {item.status === "menunggu" && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        disabled={proses !== null}
                        onClick={() => ubahStatus(item.id, "disetujui")}
                        style={tombol("#16a34a", proses === item.id)}
                      >
                        ✓ Konfirmasi Pesanan
                      </button>

                      <button
                        disabled={proses !== null}
                        onClick={() => ubahStatus(item.id, "ditolak")}
                        style={tombol("#dc2626", proses === item.id)}
                      >
                        ✕ Tolak Pesanan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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

const kotakKosong = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#666",
};

function tombol(background, disabled) {
  return {
    background,
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
    opacity: disabled ? 0.6 : 1,
  };
}
