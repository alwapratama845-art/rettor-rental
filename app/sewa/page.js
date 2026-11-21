"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { inter, Icon, SiteNav, SiteFooter } from "../components/site";

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
  const tgl = (s) =>
    s
      ? new Date(`${s}T00:00:00`).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={user.nama} />

      {/* PENGANTAR */}
      <section className="flex flex-col gap-7 bg-[#f6f3ea] px-6 pb-9 pt-7 lg:px-20">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#687773]">
          <Link href="/">Beranda</Link>
          <Icon name="chevron-right" className="size-[13px]" />
          <Link href="/motor">Daftar motor</Link>
          <Icon name="chevron-right" className="size-[13px]" />
          <span>{motorTerpilih ? motorTerpilih.nama : "Pilih motor"}</span>
          <Icon name="chevron-right" className="size-[13px]" />
          <span className="text-[#087f6d]">Sewa motor</span>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-normal leading-[1.1] tracking-[-1.8px] text-[#172f2c] lg:text-[46px]">Sewa motor</h1>
            <p className="text-[15px] text-[#687773]">Lengkapi data berikut untuk mengajukan penyewaan.</p>
          </div>

          <div className="flex items-center gap-[18px]">
            <div className="flex items-center gap-[9px]">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#e7f3ec] text-[#087f6d]">
                <Icon name="check" className="size-[15px]" />
              </span>
              <span className="text-[13px] text-[#087f6d]">Pilih motor</span>
            </div>
            <Icon name="chevron-right" className="size-[15px] text-[#687773]" />
            <div className="flex items-center gap-[9px]">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#087f6d] text-xs font-semibold text-white">2</span>
              <span className="text-[13px] font-semibold text-[#172f2c]">Data penyewa</span>
            </div>
            <Icon name="chevron-right" className="size-[15px] text-[#687773]" />
            <div className="flex items-center gap-[9px]">
              <span className="flex size-7 items-center justify-center rounded-full border border-[#dee5df] text-xs text-[#687773]">3</span>
              <span className="text-[13px] text-[#687773]">Konfirmasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULIR DAN RINGKASAN */}
      <form onSubmit={handleSubmit} className="flex flex-col items-start gap-8 px-6 pb-16 pt-10 lg:flex-row lg:px-20">
        {/* KIRI */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
          {/* 01 DATA PENYEWA */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[#dee5df] p-7">
            <SectionHead no="01" judul="Kenalan dulu, yuk." petunjuk="Gunakan data yang sesuai dengan identitas penyewa." />

            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex flex-1 flex-col gap-[9px]">
                <label className={labelCls}>Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[9px]">
                <label className={labelCls}>Nomor Telepon</label>
                <input
                  type="tel"
                  name="telepon"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value.replace(/\D/g, "").slice(0, 13))}
                  placeholder="Contoh: 081234567890"
                  maxLength={13}
                  minLength={10}
                  inputMode="numeric"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-[#687773]">
              <Icon name="message-circle" className="size-4 shrink-0" />
              Pastikan nomor aktif di WhatsApp untuk konfirmasi pesanan.
            </p>
          </div>

          {/* 02 MOTOR DAN JADWAL */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[#dee5df] p-7">
            <SectionHead no="02" judul="Atur rencana perjalananmu." petunjuk="Motor pilihanmu sudah terisi. Cek kembali tanggal sewanya." />

            <div className="flex flex-col gap-[9px]">
              <label className={labelCls}>Pilih Motor</label>
              <div className="relative">
                <select
                  value={motor}
                  onChange={(e) => setMotor(e.target.value)}
                  required
                  className={`${inputCls} appearance-none pr-11`}
                >
                  <option value="">-- Pilih Motor --</option>
                  {motorList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} – {formatRupiah(item.harga)}/hari
                    </option>
                  ))}
                </select>
                <Icon name="chevron-down" className="pointer-events-none absolute right-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#687773]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <DateField label="Tanggal Mulai" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} />
              <DateField label="Tanggal Selesai" value={tanggalSelesai} min={tanggalMulai || undefined} onChange={(e) => setTanggalSelesai(e.target.value)} />
              <DateField label="Tanggal Pengembalian" value={tanggalKembali} min={tanggalSelesai || tanggalMulai || undefined} onChange={(e) => setTanggalKembali(e.target.value)} />
            </div>
          </div>

          {/* 03 DISKON DAN PERSETUJUAN */}
          <div className="flex flex-col gap-[22px] rounded-2xl border border-[#dee5df] p-7">
            <SectionHead no="03" judul="Jalan dulu, lebih hemat." petunjuk="Makin lama sewa, makin besar diskonnya." />

            {persenDiskon > 0 ? (
              <div className="flex items-center gap-[14px] rounded-lg bg-[#e7f3ec] p-4">
                <Icon name="ticket-percent" className="size-6 shrink-0 text-[#087f6d]" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-sm font-semibold text-[#087f6d]">Diskon {persenDiskon}% diterapkan</p>
                  <p className="text-xs text-[#687773]">Potongan otomatis untuk sewa {jumlahHari} hari.</p>
                </div>
                <Icon name="circle-check" className="size-5 shrink-0 text-[#087f6d]" />
              </div>
            ) : (
              <div className="flex items-center gap-[14px] rounded-lg bg-[#f5f7f4] p-4">
                <Icon name="ticket-percent" className="size-6 shrink-0 text-[#687773]" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-sm font-semibold text-[#172f2c]">Belum ada diskon</p>
                  <p className="text-xs text-[#687773]">Sewa 3 hari: 10% · 7 hari: 15% · 14 hari: 20%.</p>
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.6] text-[#687773]">
              <input
                type="checkbox"
                checked={setujuJaminan}
                onChange={(e) => setSetujuJaminan(e.target.checked)}
                className="mt-[3px] size-[18px] shrink-0 accent-[#087f6d]"
              />
              <span>
                Saya bersedia menunjukkan KTP asli saat mengambil motor dan menyetujui ketentuan
                deposit RETTOR sebesar Rp200.000.
              </span>
            </label>
          </div>

          <div className="h-px w-full bg-[#dee5df]" />

          <button
            type="submit"
            disabled={loading}
            className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-lg border border-[#087f6d] bg-[#087f6d] text-sm font-semibold text-white transition hover:bg-[#066b5c] disabled:cursor-not-allowed disabled:border-[#9ca3af] disabled:bg-[#9ca3af]"
          >
            {loading ? "Memproses..." : "Ajukan Penyewaan"}
            {!loading && <Icon name="arrow-right" className="size-[18px]" />}
          </button>

          <p className="text-center text-xs leading-[1.6] text-[#687773]">
            Tim Rettor akan menghubungimu untuk konfirmasi ketersediaan dan pembayaran.
          </p>
        </div>

        {/* KANAN */}
        <div className="flex w-full flex-col gap-5 lg:w-[440px] lg:shrink-0">
          <div className="overflow-hidden rounded-2xl border border-[#dee5df]">
            <div className="flex flex-col gap-4 bg-[#f5f7f4] p-6">
              <p className="text-[22px] tracking-[-0.6px] text-[#172f2c]">Ringkasan Sewa</p>
              <div className="flex items-center gap-4">
                <div className="flex h-[92px] w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  {motorTerpilih?.gambar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={motorTerpilih.gambar} alt={motorTerpilih.nama} className="size-full object-cover" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="text-base font-semibold text-[#172f2c]">
                    {motorTerpilih ? motorTerpilih.nama : "Belum pilih motor"}
                  </p>
                  {motorTerpilih && (
                    <p className="text-xs text-[#687773]">
                      {motorTerpilih.jenis} · {motorTerpilih.cc} cc
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-3.5">
                <Row label="Mulai sewa" value={tgl(tanggalMulai)} />
                <Row label="Selesai sewa" value={tgl(tanggalSelesai)} />
                <Row label="Pengembalian" value={tgl(tanggalKembali)} />
              </div>

              <div className="h-px w-full bg-[#dee5df]" />

              <div className="flex flex-col gap-4">
                <Row label="Harga per hari" value={formatRupiah(hargaPerHari)} />
                <Row label="Jumlah hari" value={`${jumlahHari} hari`} />
                <Row label="Subtotal sewa" value={formatRupiah(hargaAwal)} />
                <Row label={`Diskon (${persenDiskon}%)`} value={`− ${formatRupiah(jumlahDiskon)}`} hijau />
                <Row label="Denda keterlambatan" value={formatRupiah(denda)} />
              </div>

              <div className="h-px w-full bg-[#dee5df]" />

              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-[#172f2c]">Total</p>
                <p className="text-[28px] font-semibold tracking-[-0.8px] text-[#087f6d]">{formatRupiah(totalSewa)}</p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-[#f6f3ea] p-4">
                <Row label="Deposit (jaminan)" value={formatRupiah(DEPOSIT_TETAP)} />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#172f2c]">Total pembayaran awal</p>
                  <p className="text-lg font-semibold text-[#087f6d]">{formatRupiah(totalPembayaran)}</p>
                </div>
                <p className="text-[11px] leading-normal text-[#687773]">
                  Deposit dapat dikembalikan setelah pemeriksaan motor oleh admin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-[#f6f3ea] p-5">
            <Icon name="shield-check" className="size-[22px] shrink-0 text-[#087f6d]" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-[#172f2c]">Siapkan KTP &amp; SIM C aktif</p>
              <p className="text-xs leading-[1.7] text-[#687773]">
                Tunjukkan identitas asli saat serah terima. Data pribadimu hanya digunakan untuk keperluan sewa.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5">
            <p className="text-base text-[#172f2c]">Butuh teman ngobrol?</p>
            <p className="text-[13px] leading-[1.6] text-[#687773]">Kami siap bantu rencana perjalananmu.</p>
            <a
              href="https://wa.me/6285219579928"
              target="_blank"
              rel="noreferrer"
              className="flex h-[50px] items-center justify-center gap-2.5 rounded-lg border border-[#dee5df] bg-white text-sm font-semibold text-[#172f2c]"
            >
              Hubungi Rettor
              <Icon name="message-circle" className="size-[18px]" />
            </a>
          </div>
        </div>
      </form>

      <SiteFooter />
    </div>
  );
}

const inputCls =
  "min-h-[50px] w-full rounded-lg border border-[#dee5df] bg-white p-[14px] text-sm text-[#172f2c] placeholder:text-[#687773] focus:border-[#087f6d] focus:outline-none focus:ring-2 focus:ring-[#087f6d]/20";
const labelCls = "text-[13px] font-semibold text-[#172f2c]";

function SectionHead({ no, judul, petunjuk }) {
  return (
    <div className="flex w-full items-start gap-[14px]">
      <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#e7f3ec] text-[13px] font-semibold text-[#087f6d]">
        {no}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-xl tracking-[-0.5px] text-[#172f2c]">{judul}</p>
        <p className="text-[13px] leading-[1.6] text-[#687773]">{petunjuk}</p>
      </div>
    </div>
  );
}

function DateField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-[9px]">
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type="date"
          required
          {...props}
          className={`${inputCls} pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
        />
        <Icon name="calendar-days" className="pointer-events-none absolute right-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#087f6d]" />
      </div>
    </div>
  );
}

function Row({ label, value, hijau }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${hijau ? "text-[#087f6d]" : ""}`}>
      <p className={`text-[13px] ${hijau ? "" : "text-[#687773]"}`}>{label}</p>
      <p className={`text-sm font-medium ${hijau ? "" : "text-[#172f2c]"}`}>{value}</p>
    </div>
  );
}