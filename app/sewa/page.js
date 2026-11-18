
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DENDA_PER_HARI = 50000;
const DEPOSIT_TETAP = 200000;

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

  const [setujuJaminan, setSetujuJaminan] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ambil data user dan batasi akses admin
  useEffect(() => {
    const dataUser = localStorage.getItem("rettor_user");

    if (!dataUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(dataUser);

      if (userData.role === "admin") {
        alert("Admin hanya dapat melihat detail motor dan tidak dapat menyewa.");
        window.location.href = "/motor";
        return;
      }

      setUser(userData);
      setNama(userData.nama || "");
    } catch (error) {
      localStorage.removeItem("rettor_user");
      window.location.href = "/login";
    }
  }, []);

  // Ambil data motor
  useEffect(() => {
    const ambilMotor = async () => {
      try {
        const response = await fetch("/api/motor");
        const data = await response.json();

        if (data.success) {
          setMotorList(data.motor || []);

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

  const motorTerpilih = motorList.find(
    (item) => String(item.id) === String(motor)
  );

  // Hitung jumlah hari
  const hitungHari = () => {
    if (!tanggalMulai || !tanggalSelesai) return 0;

    const mulai = new Date(`${tanggalMulai}T00:00:00`);
    const selesai = new Date(`${tanggalSelesai}T00:00:00`);

    const selisih =
      (selesai - mulai) / (1000 * 60 * 60 * 24);

    return selisih >= 1 ? selisih : 0;
  };

  const jumlahHari = hitungHari();

  // Hitung diskon
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
  const jumlahDiskon = hargaAwal * (persenDiskon / 100);
  const totalHarga = hargaAwal - jumlahDiskon;

  // Hitung keterlambatan
  const hitungTerlambat = () => {
    if (!tanggalSelesai || !tanggalKembali) return 0;

    const selesai = new Date(`${tanggalSelesai}T00:00:00`);
    const kembali = new Date(`${tanggalKembali}T00:00:00`);

    const selisih =
      (kembali - selesai) / (1000 * 60 * 60 * 24);

    return selisih > 0 ? selisih : 0;
  };

  const hariTerlambat = hitungTerlambat();
  const denda = hariTerlambat * DENDA_PER_HARI;

  const totalSewa = totalHarga + denda;
  const totalPembayaran = totalSewa + DEPOSIT_TETAP;

  // Format rupiah
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

    if (user.role === "admin") {
      alert("Admin tidak diperbolehkan melakukan penyewaan.");
      window.location.href = "/motor";
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

    if (new Date(`${tanggalKembali}T00:00:00`) <
        new Date(`${tanggalSelesai}T00:00:00`)) {
      alert("Tanggal pengembalian tidak boleh sebelum tanggal selesai.");
      return;
    }

    if (!/^[0-9]{10,13}$/.test(telepon)) {
      alert("Nomor telepon harus terdiri dari 10 sampai 13 angka.");
      return;
    }

    if (!setujuJaminan) {
      alert("Silakan setujui persyaratan jaminan KTP dan deposit.");
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
          nama,
          telepon,
          motor: motorTerpilih.nama,
          harga_per_hari: hargaPerHari,
          persen_diskon: persenDiskon,
          jumlah_diskon: jumlahDiskon,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          tanggal_kembali: tanggalKembali,
          jumlah_hari: jumlahHari,
          hari_terlambat: hariTerlambat,
          denda,
          total_harga: totalSewa,
          jumlah_deposit: DEPOSIT_TETAP,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membuat pesanan.");
        return;
      }

      alert(
        "Penyewaan berhasil diajukan!\n\n" +
        "Biaya sewa: " + formatRupiah(totalSewa) +
        "\nDeposit: " + formatRupiah(DEPOSIT_TETAP) +
        "\nTotal pembayaran awal: " + formatRupiah(totalPembayaran) +
        "\n\nJangan lupa membawa KTP asli saat pengambilan motor."
      );

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
      <main style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}>
        <h2>Memuat...</h2>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      fontFamily: "Arial, sans-serif",
    }}>

      {/* NAVBAR */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}>
          <a href="/" style={{
            textDecoration: "none",
            fontSize: "28px",
            fontWeight: "900",
            color: "#2563eb",
          }}>
            RETTOR
          </a>

          <div style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
          }}>
            {[
              ["/", "Beranda"],
              ["/motor", "Motor"],
              ["/pesanan", "Pesanan Saya"],
              ["/profil", "Profil"],
            ].map(([link, label]) => (
              <a key={link} href={link} style={{
                textDecoration: "none",
                color: "#374151",
                fontWeight: "600",
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* FORM SEWA */}
      <section style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "50px 25px",
      }}>
        <h1 style={{
          margin: 0,
          color: "#111827",
          fontSize: "34px",
        }}>
          Sewa Motor
        </h1>

        <p style={{
          color: "#6b7280",
          marginTop: "10px",
        }}>
          Lengkapi data berikut untuk mengajukan penyewaan.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            marginTop: "30px",
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
          }}>

            {/* NAMA */}
            <label style={labelStyle}>Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              style={inputStyle}
            />

            {/* NOMOR TELEPON */}
            <label style={labelStyle}>Nomor Telepon</label>
            <input
              type="tel"
              name="telepon"
              value={telepon}
              onChange={(e) => {
                const angka = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 13);

                setTelepon(angka);
              }}
              placeholder="Contoh: 081234567890"
              maxLength={13}
              minLength={10}
              inputMode="numeric"
              required
              style={inputStyle}
            />

            <p style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "-12px",
              marginBottom: "22px",
            }}>
              Masukkan 10–13 digit nomor HP. Maksimal 13 angka.
            </p>

            {/* PILIH MOTOR */}
            <label style={labelStyle}>Pilih Motor</label>
            <select
              value={motor}
              onChange={(e) => setMotor(e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">-- Pilih Motor --</option>
              {motorList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - {formatRupiah(item.harga)}/hari
                </option>
              ))}
            </select>

            {/* TANGGAL */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}>
              <div>
                <label style={labelStyle}>Tanggal Mulai</label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Tanggal Selesai</label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  min={tanggalMulai || undefined}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Tanggal Pengembalian</label>
                <input
                  type="date"
                  value={tanggalKembali}
                  min={tanggalSelesai || tanggalMulai || undefined}
                  onChange={(e) => setTanggalKembali(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* RINGKASAN */}
            {motorTerpilih && (
              <div style={{
                marginTop: "30px",
                padding: "25px",
                background: "#eff6ff",
                borderRadius: "12px",
                color: "#111827",
              }}>
                <h2 style={{
                  marginTop: 0,
                  marginBottom: "22px",
                  color: "#111827",
                  fontSize: "22px",
                }}>
                  Ringkasan Sewa
                </h2>

                <div style={{
                  display: "grid",
                  gap: "12px",
                }}>
                  <p style={rowStyle}>
                    Motor: <strong>{motorTerpilih.nama}</strong>
                  </p>

                  <p style={rowStyle}>
                    Harga per hari: <strong>{formatRupiah(hargaPerHari)}</strong>
                  </p>

                  <p style={rowStyle}>
                    Jumlah hari: <strong>{jumlahHari} hari</strong>
                  </p>

                  <p style={rowStyle}>
                    Diskon: <strong>{persenDiskon}% ({formatRupiah(jumlahDiskon)})</strong>
                  </p>

                  <p style={rowStyle}>
                    Denda keterlambatan: <strong>{formatRupiah(denda)}</strong>
                  </p>
                </div>

                <hr style={{
                  margin: "20px 0",
                  border: "none",
                  borderTop: "1px solid #dbe3ef",
                }} />

                <div style={{ display: "grid", gap: "12px" }}>
                  <p style={rowStyle}>
                    Biaya sewa: <strong>{formatRupiah(totalSewa)}</strong>
                  </p>

                  <p style={rowStyle}>
                    Deposit (jaminan): <strong>{formatRupiah(DEPOSIT_TETAP)}</strong>
                  </p>

                  <p style={{
                    ...rowStyle,
                    color: "#15803d",
                  }}>
                    Deposit dapat dikembalikan setelah pemeriksaan motor oleh admin.
                  </p>
                </div>

                <div style={{
                  marginTop: "20px",
                  padding: "18px",
                  background: "white",
                  borderRadius: "10px",
                }}>
                  <p style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "14px",
                  }}>
                    TOTAL PEMBAYARAN AWAL
                  </p>

                  <h2 style={{
                    color: "#2563eb",
                    margin: "8px 0 0",
                    fontSize: "26px",
                  }}>
                    {formatRupiah(totalPembayaran)}
                  </h2>
                </div>
              </div>
            )}

            {/* KETENTUAN JAMINAN */}
            <div style={{
              marginTop: "25px",
              padding: "20px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "10px",
              color: "#9a3412",
            }}>
              <h3 style={{
                margin: "0 0 12px",
                fontSize: "18px",
              }}>
                Persyaratan Jaminan Penyewaan
              </h3>

              <ul style={{
                paddingLeft: "20px",
                lineHeight: "1.9",
                marginBottom: 0,
              }}>
                <li>
                  Pelanggan wajib menunjukkan KTP asli kepada admin
                  saat pengambilan motor.
                </li>
                <li>
                  KTP digunakan untuk verifikasi identitas dan tidak
                  perlu diunggah ke website.
                </li>
                <li>
                  Deposit sebesar Rp200.000 per pesanan.
                </li>
                <li>
                  Deposit dibayarkan terpisah dari biaya sewa.
                </li>
                <li>
                  Deposit dikembalikan setelah motor diperiksa admin.
                </li>
                <li>
                  Jika terdapat kerusakan, admin akan melakukan
                  pemeriksaan terlebih dahulu.
                </li>
              </ul>
            </div>

            {/* PERSETUJUAN */}
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginTop: "22px",
              color: "#374151",
              lineHeight: "1.6",
              cursor: "pointer",
            }}>
              <input
                type="checkbox"
                checked={setujuJaminan}
                onChange={(e) => setSetujuJaminan(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  marginTop: "3px",
                  accentColor: "#2563eb",
                  flexShrink: 0,
                }}
              />

              <span>
                Saya bersedia menunjukkan KTP asli saat mengambil motor
                dan menyetujui ketentuan deposit RETTOR sebesar Rp200.000.
              </span>
            </label>

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
                background: loading ? "#9ca3af" : "#2563eb",
                color: "white",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Memproses..." : "Ajukan Penyewaan"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  color: "#111827",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
  marginBottom: "20px",
  color: "#111827",
  background: "white",
  fontSize: "16px",
};

const rowStyle = {
  margin: 0,
  color: "#111827",
  fontSize: "16px",
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
};
