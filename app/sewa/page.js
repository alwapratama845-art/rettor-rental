"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DENDA_PER_HARI = 50000;

export default function SewaPage() {
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [motorList, setMotorList] = useState([]);

  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [motor, setMotor] = useState("");

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");

  const [loading, setLoading] = useState(false);

  // Ambil user yang sedang login
  useEffect(() => {
    const dataUser = localStorage.getItem("rettor_user");

    if (!dataUser) {
      window.location.href = "/login";
      return;
    }

    const userData = JSON.parse(dataUser);

    setUser(userData);
    setNama(userData.nama);
  }, []);

  // Ambil data motor dari PostgreSQL
  useEffect(() => {
    const ambilMotor = async () => {
      try {
        const response = await fetch("/api/motor");
        const data = await response.json();

        if (data.success) {
          setMotorList(data.motor);

          // Ambil motor dari URL
          const motorId = searchParams.get("motor");

          if (motorId) {
            const motorDipilih = data.motor.find(
              (item) => String(item.id) === String(motorId)
            );

            if (motorDipilih) {
              setMotor(String(motorDipilih.id));
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil motor:", error);
      }
    };

    ambilMotor();
  }, [searchParams]);

  // Cari data motor yang dipilih
  const motorTerpilih = motorList.find(
    (item) => String(item.id) === String(motor)
  );

  // Hitung jumlah hari
  const hitungHari = () => {
    if (!tanggalMulai || !tanggalSelesai) {
      return 0;
    }

    const mulai = new Date(tanggalMulai);
    const selesai = new Date(tanggalSelesai);

    const selisih =
      (selesai - mulai) / (1000 * 60 * 60 * 24);

    return selisih >= 1 ? selisih : 0;
  };

  const jumlahHari = hitungHari();

  // Diskon
  const hitungDiskon = () => {
    if (jumlahHari >= 14) return 20;
    if (jumlahHari >= 7) return 15;
    if (jumlahHari >= 3) return 10;
    return 0;
  };

  const persenDiskon = hitungDiskon();

  const hargaPerHari = motorTerpilih
    ? Number(motorTerpilih.harga)
    : 0;

  const hargaAwal = hargaPerHari * jumlahHari;

  const jumlahDiskon =
    hargaAwal * (persenDiskon / 100);

  const totalHarga =
    hargaAwal - jumlahDiskon;

  // Hitung keterlambatan
  const hitungTerlambat = () => {
    if (!tanggalSelesai || !tanggalKembali) {
      return 0;
    }

    const selesai = new Date(tanggalSelesai);
    const kembali = new Date(tanggalKembali);

    const selisih =
      (kembali - selesai) /
      (1000 * 60 * 60 * 24);

    return selisih > 0 ? selisih : 0;
  };

  const hariTerlambat = hitungTerlambat();
  const denda = hariTerlambat * DENDA_PER_HARI;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Kirim pesanan
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    if (!motorTerpilih) {
      alert("Silakan pilih motor.");
      return;
    }

    if (jumlahHari <= 0) {
      alert("Tanggal selesai harus setelah tanggal mulai.");
      return;
    }

    if (!tanggalKembali) {
      alert("Silakan pilih tanggal pengembalian.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/pesanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,

          nama: nama,
          telepon: telepon,

          motor: motorTerpilih.nama,

          harga_per_hari: hargaPerHari,

          persen_diskon: persenDiskon,

          jumlah_diskon: jumlahDiskon,

          tanggal_mulai: tanggalMulai,

          tanggal_selesai: tanggalSelesai,

          tanggal_kembali: tanggalKembali,

          jumlah_hari: jumlahHari,

          hari_terlambat: hariTerlambat,

          denda: denda,

          total_harga: totalHarga + denda,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membuat pesanan.");
        return;
      }

      alert(
        "Penyewaan berhasil diajukan!\n\nPesanan kamu sekarang menunggu konfirmasi admin."
      );

      // Langsung ke Pesanan Saya
      window.location.href = "/pesanan";

    } catch (error) {
      console.error("SEWA ERROR:", error);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

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
        <h2>Memuat...</h2>
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
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Profil
            </a>
          </div>
        </div>
      </nav>

      {/* FORM SEWA */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "50px 25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "34px",
          }}
        >
          Sewa Motor
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "10px",
          }}
        >
          Lengkapi data berikut untuk mengajukan penyewaan.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginTop: "30px",
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* NAMA */}
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              Nama
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginBottom: "20px",
                color: "#111827",
                background: "white",
              }}
            />

            {/* TELEPON */}
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              Nomor Telepon
            </label>

            <input
              type="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="Masukkan nomor telepon"
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginBottom: "20px",
                color: "#111827",
                background: "white",
              }}
            />

            {/* MOTOR */}
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              Pilih Motor
            </label>

            <select
              value={motor}
              onChange={(e) => setMotor(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
                marginBottom: "20px",
                color: "#111827",
                background: "white",
              }}
            >
              <option value="">-- Pilih Motor --</option>

              {motorList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - {formatRupiah(item.harga)}/hari
                </option>
              ))}
            </select>

            {/* TANGGAL */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Tanggal Mulai
                </label>

                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) =>
                    setTanggalMulai(e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    color: "#111827",
                    background: "white",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Tanggal Selesai
                </label>

                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) =>
                    setTanggalSelesai(e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    color: "#111827",
                    background: "white",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Tanggal Pengembalian
                </label>

                <input
                  type="date"
                  value={tanggalKembali}
                  onChange={(e) =>
                    setTanggalKembali(e.target.value)
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    color: "#111827",
                    background: "white",
                  }}
                />
              </div>
            </div>

          {/* RINGKASAN */}
{motorTerpilih && (
  <div
    style={{
      marginTop: "30px",
      padding: "25px",
      background: "#eff6ff",
      borderRadius: "12px",
      color: "#111827",
    }}
  >
    <h2
      style={{
        marginTop: 0,
        marginBottom: "22px",
        color: "#111827",
        fontSize: "22px",
      }}
    >
      Ringkasan Sewa
    </h2>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "16px",
        }}
      >
        Motor:{" "}
        <strong style={{ color: "#111827" }}>
          {motorTerpilih.nama}
        </strong>
      </p>

      <p
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "16px",
        }}
      >
        Harga per hari:{" "}
        <strong style={{ color: "#111827" }}>
          {formatRupiah(hargaPerHari)}
        </strong>
      </p>

      <p
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "16px",
        }}
      >
        Jumlah hari:{" "}
        <strong style={{ color: "#111827" }}>
          {jumlahHari} hari
        </strong>
      </p>

      <p
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "16px",
        }}
      >
        Diskon:{" "}
        <strong style={{ color: "#111827" }}>
          {persenDiskon}% ({formatRupiah(jumlahDiskon)})
        </strong>
      </p>

      <p
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "16px",
        }}
      >
        Denda keterlambatan:{" "}
        <strong style={{ color: "#111827" }}>
          {formatRupiah(denda)}
        </strong>
      </p>
    </div>

    <hr
      style={{
        margin: "20px 0",
        border: "none",
        borderTop: "1px solid #dbe3ef",
      }}
    />

    <h2
      style={{
        color: "#2563eb",
        margin: 0,
        fontSize: "22px",
      }}
    >
      Total:{" "}
      <strong>
        {formatRupiah(totalHarga + denda)}
      </strong>
    </h2>
  </div>
)}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "30px",
                padding: "15px",
                border: "none",
                borderRadius: "9px",
                background: loading
                  ? "#9ca3af"
                  : "#2563eb",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Memproses..."
                : "Ajukan Penyewaan"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}