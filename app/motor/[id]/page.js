
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { inter, Icon, SiteNav, SiteFooter } from "../../components/site";

const LOKASI_RENTAL = "Cakung, Jakarta";

export default function DetailMotor() {
  const params = useParams();
  const id = params.id;

  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [namaUser, setNamaUser] = useState("");
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("rettor_user") || "null");
      setRole(user?.role || null);
      setNamaUser(user?.nama || "");
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

  // Estimasi biaya (aturan diskon sama dengan halaman sewa)
  const hargaHarian = Number(motor.harga) || 0;
  const hitungHari = () => {
    if (!mulai || !selesai) return 0;
    const selisih =
      (new Date(`${selesai}T00:00:00`) - new Date(`${mulai}T00:00:00`)) /
      (1000 * 60 * 60 * 24);
    return selisih >= 1 ? selisih : 0;
  };
  const hari = hitungHari();
  const persenDiskon = hari >= 14 ? 20 : hari >= 7 ? 15 : hari >= 3 ? 10 : 0;
  const subtotal = hargaHarian * hari;
  const potongan = subtotal * (persenDiskon / 100);
  const estimasiTotal = subtotal - potongan;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={namaUser} admin={isAdmin} />

      {/* PENGANTAR */}
      <section className="flex flex-col gap-[26px] bg-[#f6f3ea] px-6 pb-9 pt-7 lg:px-20">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#687773]">
          <Link href="/">Beranda</Link>
          <Icon name="chevron-right" className="size-[13px]" />
          <Link href="/motor">Daftar motor</Link>
          <Icon name="chevron-right" className="size-[13px]" />
          <span className="text-[#087f6d]">{motor.nama}</span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-[1.8px] text-[#087f6d]">TEMAN JALAN PILIHANMU</p>
            <h1 className="text-4xl font-normal leading-[1.1] tracking-[-1.8px] text-[#172f2c] lg:text-[46px]">{motor.nama}</h1>
          </div>
          <div className="flex items-center gap-2 pb-1.5 text-sm text-[#172f2c]">
            <Icon name="map-pin" className="size-[18px] text-[#087f6d]" />
            {LOKASI_RENTAL}
          </div>
        </div>
      </section>

      {/* DETAIL DAN PEMESANAN */}
      <section className="flex flex-col gap-7 px-6 pb-16 pt-9 lg:px-20">
        <Link href="/motor" className="flex w-fit items-center gap-2 text-[13px] text-[#087f6d]">
          <Icon name="arrow-left" className="size-4" />
          Kembali ke daftar motor
        </Link>

        <div className="flex flex-col items-start gap-10 lg:flex-row">
          {/* KIRI: INFORMASI MOTOR */}
          <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
            <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-[#dee5df] bg-white p-6 sm:h-[448px]">
              {motor.gambar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={motor.gambar} alt={motor.nama} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-8xl">🏍️</span>
              )}

              <span className="absolute left-[23px] top-[23px] flex items-center gap-[7px] rounded-full bg-[#e7f3ec] px-3 py-2 text-xs font-semibold text-[#087f6d]">
                <span className="size-1.5 rounded-full bg-[#087f6d]" />
                Tersedia
              </span>
              <span className="absolute right-[23px] top-[23px] rounded-full bg-[#f5f7f4] px-3 py-2 text-xs text-[#172f2c]">
                {String(motor.jenis || "").toLowerCase()}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Spesifikasi ikon="settings-2" label="Jenis" nilai={motor.jenis} />
              <Spesifikasi ikon="gauge" label="Kapasitas mesin" nilai={`${motor.cc} cc`} />
              <Spesifikasi ikon="shield-check" label="Perlengkapan" nilai="2 helm" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <p className="text-2xl tracking-[-0.6px] text-[#172f2c]">Siap untuk arah yang baru.</p>
              <p className="text-[15px] leading-[1.75] text-[#687773]">
                {motor.nama}, teman jalan untuk mobilitas harian maupun perjalanan akhir pekan.
                Dengan mesin {motor.cc} cc, motor ini siap menemanimu ke arah yang baru.
              </p>
              <div className="flex flex-wrap gap-5 pt-1">
                {["Motor terawat", "2 helm termasuk", "STNK aktif"].map((f) => (
                  <span key={f} className="flex items-center gap-[7px] text-xs text-[#172f2c]">
                    <Icon name="check" className="size-4 text-[#087f6d]" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KANAN: RENCANAKAN SEWA */}
          <div className="flex w-full flex-col gap-[22px] self-start rounded-2xl border border-[#dee5df] bg-white p-7 lg:w-[432px] lg:shrink-0">
            <div className="flex flex-col gap-[9px]">
              <p className="text-[13px] text-[#687773]">Harga sewa per hari</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-[32px] font-semibold tracking-[-1px] text-[#172f2c]">{formatRupiah(motor.harga)}</p>
                <p className="text-[13px] text-[#687773]">/ hari</p>
              </div>
            </div>

            <div className="h-px w-full bg-[#dee5df]" />

            {!isAdmin ? (
              <>
                <div className="flex flex-col gap-4">
                  <p className="text-[17px] font-semibold text-[#172f2c]">Kapan mau jalan?</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DateField label="Tanggal mulai" value={mulai} onChange={(e) => setMulai(e.target.value)} />
                    <DateField label="Tanggal selesai" value={selesai} min={mulai || undefined} onChange={(e) => setSelesai(e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-[#687773]">{formatRupiah(hargaHarian)} × {hari} hari</p>
                    <p className="text-sm font-medium text-[#172f2c]">{formatRupiah(subtotal)}</p>
                  </div>
                  {persenDiskon > 0 && (
                    <div className="flex items-center justify-between text-[#087f6d]">
                      <p className="text-[13px]">Diskon ({persenDiskon}%)</p>
                      <p className="text-sm font-medium">− {formatRupiah(potongan)}</p>
                    </div>
                  )}
                  <div className="h-px w-full bg-[#dee5df]" />
                  <div className="flex items-center justify-between text-[#172f2c]">
                    <p className="text-sm font-medium">Estimasi total</p>
                    <p className="text-2xl font-semibold tracking-[-0.6px]">{formatRupiah(estimasiTotal)}</p>
                  </div>
                </div>

                <Link
                  href={`/sewa?motor=${motor.id}`}
                  className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-lg border border-[#087f6d] bg-[#087f6d] text-sm font-semibold text-white transition hover:bg-[#066b5c]"
                >
                  Sewa Motor Ini
                  <Icon name="arrow-right" className="size-[18px]" />
                </Link>

                <p className="text-center text-xs leading-[1.6] text-[#687773]">Lengkapi data di langkah berikutnya.</p>
              </>
            ) : (
              <div className="rounded-lg bg-[#e7f3ec] p-4 text-center text-sm font-semibold leading-[1.6] text-[#087f6d]">
                Anda masuk sebagai Admin. Fitur penyewaan hanya tersedia untuk pelanggan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PANDUAN SEBELUM SEWA */}
      <section className="flex flex-col gap-8 bg-[#f5f7f4] px-6 py-14 lg:px-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold tracking-[1.8px] text-[#087f6d]">BIAR JALAN MAKIN TENANG</p>
          <p className="text-[32px] tracking-[-1px] text-[#172f2c]">Sebelum ambil kunci.</p>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {[
            ["contact-round", "Siapkan identitasmu", "KTP dan SIM C aktif wajib ditunjukkan saat serah terima motor. Pastikan data penyewa sesuai identitas."],
            ["truck", "Motor diantar, tinggal jalan", "Tim Rettor akan menghubungimu untuk konfirmasi ketersediaan dan serah terima motor."],
            ["calendar-check", "Kembalikan sesuai jadwal", "Jaga kondisi motor dan kembalikan tepat waktu. Keterlambatan mengikuti ketentuan sewa yang berlaku."],
          ].map(([ikon, judul, isi]) => (
            <div key={judul} className="flex flex-1 flex-col gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#087f6d]">
                <Icon name={ikon} className="size-5" />
              </span>
              <p className="text-lg font-medium text-[#172f2c]">{judul}</p>
              <p className="text-sm leading-[1.65] text-[#687773]">{isi}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Spesifikasi({ ikon, label, nilai }) {
  return (
    <div className="flex items-center gap-[14px] rounded-2xl bg-[#f5f7f4] p-5">
      <Icon name={ikon} className="size-6 shrink-0 text-[#087f6d]" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-xs text-[#687773]">{label}</p>
        <p className="truncate text-base font-medium text-[#172f2c]">{nilai}</p>
      </div>
    </div>
  );
}

function DateField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-[9px]">
      <label className="text-[13px] font-semibold text-[#172f2c]">{label}</label>
      <div className="relative">
        <input
          type="date"
          {...props}
          className="min-h-[50px] w-full rounded-lg border border-[#dee5df] bg-white p-[14px] pr-11 text-sm text-[#172f2c] focus:border-[#087f6d] focus:outline-none focus:ring-2 focus:ring-[#087f6d]/20 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <Icon name="calendar-days" className="pointer-events-none absolute right-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#087f6d]" />
      </div>
    </div>
  );
}
