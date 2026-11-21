"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { inter, Icon, SiteNav, SiteFooter } from "./components/site";

// ================= DATA TAMPILAN =================
// Teks pelengkap di kartu motor (lokasi, rating, label) tidak ada di database,
// jadi dipakai sama seperti di Figma. Urutannya mengikuti urutan kartu.
const LABEL_KARTU = ["Paling laris", "Nyaman berdua", "Gesit di kota", "Jalan lebih gaya", "Jalan lebih gaya"];
const NILAI_KARTU = ["4,9 (128)", "4,9 (96)", "4,8 (84)", "4,9 (72)", "4,9 (72)"];
const LEBAR_KARTU = [283, 227, 250, 284, 284];

const KATEGORI = [
  { id: "semua", label: "Semua motor", ikon: "bike", sub: "Temukan favoritmu" },
  { id: "matic", label: "Matic", ikon: "gauge", sub: "Praktis setiap hari" },
  { id: "vespa", label: "Vespa", ikon: "sparkles", sub: "Santai penuh gaya" },
  { id: "sport", label: "Sport & manual", ikon: "route", sub: "Untuk jiwa penjelajah" },
  { id: "listrik", label: "Motor listrik", ikon: "zap", sub: "Lebih ramah bumi" },
];

const LANGKAH = [
  { no: "01", ikon: "search", judul: "Temukan motor pilihan", isi: "Pilih kota, tanggal, dan motor yang cocok dengan rencana perjalananmu." },
  { no: "02", ikon: "badge-check", judul: "Lengkapi data & pesan", isi: "Siapkan KTP dan SIM C aktif. Konfirmasi pesanan dan bayar dengan aman." },
  { no: "03", ikon: "key-round", judul: "Ambil kunci, mulai jalan", isi: "Motor di antar ke rumah. dan siap di gunakan untuk jalan jalan." },
];

function cocokKategori(item, id) {
  const nama = String(item.nama || "").toLowerCase();
  const jenis = String(item.jenis || "").toLowerCase();

  if (id === "matic") return jenis === "matic";
  if (id === "vespa") return nama.includes("vespa");
  if (id === "sport") return jenis === "sport" || jenis === "manual";
  if (id === "listrik") return jenis === "listrik" || nama.includes("listrik");
  return true;
}

export default function HomePage() {
  const [motorList, setMotorList] = useState([]);
  const [user, setUser] = useState(null);
  const [kategori, setKategori] = useState("semua");

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
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
  };

  const sudahLogin = Boolean(user);
  const daftarMotor = motorList.filter((item) => cocokKategori(item, kategori));

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={user?.nama} login={sudahLogin} />

      <main className="leading-[normal]">
        {/* ================= HERO ================= */}
        <section className="flex flex-col bg-[#f6f3ea] lg:h-[560px] lg:flex-row">
          <div className="flex flex-col items-start gap-6 px-6 pb-12 pt-[52px] lg:w-[695px] lg:shrink-0 lg:pl-20 lg:pr-11">
            <div className="flex items-center gap-2">
              <span className="size-[7px] rounded-full bg-[#087f6d]" />
              <p className="text-xs font-bold tracking-[1.5px] text-[#087f6d]">DKI Jakarta</p>
            </div>

            <h1 className="text-[44px] font-normal leading-[1.07] tracking-[-2px] text-[#172f2c] lg:text-[62px] lg:tracking-[-3px]">
              Kotanya baru.
              <br />
              Bebas jalannya.
            </h1>

            <p className="w-[480px] max-w-full text-[17px] leading-[1.65] text-[#687773]">
              Sewa motor pilihan untuk agenda spontan, urusan harian, atau liburan. Pesan mudah, tinggal jalan.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-[7px]">
                <Icon name="star" className="size-[18px] text-[#ae781f]" />
                <p className="text-[15px] font-bold text-[#172f2c]">4,9/5</p>
              </div>
              <div className="h-[22px] w-px bg-[#dee5df]" />
              <p className="text-[13px] text-[#687773]">Dipercaya 12.000+ teman jalan</p>
            </div>
          </div>

          <div className="relative min-h-[420px] flex-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/login-hero.png" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />

            <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white px-[14px] py-[10px]">
              <Icon name="map-pin" className="size-4 text-[#087f6d]" />
              <p className="whitespace-nowrap text-xs font-semibold text-[#172f2c]">DKI Jakarta</p>
            </div>

            <div className="absolute bottom-[30px] left-8 flex flex-col gap-[5px] rounded-2xl bg-[#103f37] p-[18px]">
              <p className="whitespace-nowrap text-sm font-semibold text-white">Jalan pelan. Temukan lebih banyak.</p>
              <p className="whitespace-nowrap text-xs text-[#e7f3ec]">Mulai petualangan kecilmu bersama Rettor.</p>
            </div>
          </div>
        </section>

        {/* ================= PILIHAN MOTOR ================= */}
        <section className="flex flex-col gap-9 px-6 pb-[72px] pt-14 lg:px-20">
          {/* KATEGORI */}
          <div className="flex gap-[18px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {KATEGORI.map((k) => {
              const aktif = kategori === k.id;

              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKategori(k.id)}
                  className={`flex min-w-[200px] flex-1 items-center gap-3 rounded-2xl border text-left lg:min-w-0 ${
                    sudahLogin ? "h-11 px-4" : "p-4"
                  } ${aktif ? "border-[#087f6d] bg-[#e7f3ec]" : "border-[#f5f7f4] bg-[#f5f7f4]"}`}
                >
                  <Icon name={k.ikon} className="size-6 shrink-0 text-[#087f6d]" />
                  <span className={`flex flex-col whitespace-nowrap ${sudahLogin ? "" : "gap-1.5"}`}>
                    <span className="text-[13px] text-[#172f2c]">{k.label}</span>
                    {!sudahLogin && <span className="text-[10px] text-[#687773]">{k.sub}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PENGANTAR KATALOG */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <p className="text-xs font-bold tracking-[1.8px] text-[#087f6d]">PILIHAN TEMAN JALAN</p>
              <h2 className="text-[30px] font-normal leading-[1.18] tracking-[-1.4px] text-[#172f2c] lg:text-[38px]">
                Motor pas, perjalanan puas.
              </h2>
            </div>

            <Link href="/motor" className="flex shrink-0 items-center gap-2 pb-1.5 text-sm text-[#087f6d]">
              Lihat semua motor
              <Icon name="arrow-right" className="size-[18px]" />
            </Link>
          </div>

          {/* KATALOG MOTOR */}
          <div className="flex items-start gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {daftarMotor.length === 0 && (
              <div className="w-full rounded-2xl border border-[#dee5df] p-10 text-center text-sm text-[#687773]">
                {motorList.length === 0 ? "Belum ada motor." : "Belum ada motor untuk kategori ini."}
              </div>
            )}

            {daftarMotor.map((item, i) => (
              <div
                key={item.id}
                style={{ width: LEBAR_KARTU[i] ?? 284 }}
                className="flex shrink-0 flex-col overflow-hidden rounded-2xl border border-[#dee5df] bg-white"
              >
                {/* FOTO */}
                <div className="relative h-[214px] w-full overflow-hidden bg-[#f5f7f4]">
                  {item.gambar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.gambar} alt={item.nama} className="size-full object-cover" />
                  )}
                  <div className="absolute left-[14px] top-[14px] rounded-lg bg-white px-[9px] py-1.5">
                    <p className="whitespace-nowrap text-[10px] font-semibold text-[#087f6d]">
                      {LABEL_KARTU[i % LABEL_KARTU.length]}
                    </p>
                  </div>
                </div>

                {/* INFORMASI */}
                <div className="flex flex-col gap-[14px] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icon name="map-pin" className="size-[13px] text-[#687773]" />
                      <p className="whitespace-nowrap text-[11px] text-[#687773]">Cakung, Jakarta</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="star" className="size-3 text-[#ae781f]" />
                      <p className="whitespace-nowrap text-[11px] text-[#172f2c]">{NILAI_KARTU[i % NILAI_KARTU.length]}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[7px]">
                    <p className="text-[20px] tracking-[-0.5px] text-[#172f2c]">{item.nama}</p>
                    <p className="whitespace-nowrap text-xs text-[#687773]">
                      {item.jenis} · {item.cc} cc · 2 helm termasuk
                    </p>
                  </div>

                  <div className="h-px w-full bg-[#dee5df]" />

                  <div className="flex flex-col gap-[5px] whitespace-nowrap">
                    <p className="text-[11px] text-[#687773]">Mulai dari</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-[22px] font-bold tracking-[-0.7px] text-[#172f2c]">{formatRupiah(item.harga)}</p>
                      <p className="text-xs text-[#687773]">/ hari</p>
                    </div>
                  </div>

                  <Link
                    href={`/motor/${item.id}`}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e7f3ec] text-[13px] text-[#087f6d]"
                  >
                    Pilih motor
                    <Icon name="arrow-up-right" className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CATATAN */}
          <div className="flex items-start justify-center gap-[7px]">
            <Icon name="info" className="size-[14px] shrink-0 text-[#687773]" />
            <p className="text-xs text-[#687773]">Baca ketentuan sewa sebelum mensewa</p>
          </div>
        </section>

        {/* ================= PROMO ================= */}
        <section className="px-6 pb-20 lg:px-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:overflow-x-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            <KartuPromo
              eyebrow="PERJALANAN PERTAMA, LEBIH HEMAT"
              baris1="Jalan dulu."
              baris2="Hemat hingga 10%."
              syarat="Min. sewa 3 hari."
              kode="JALANBARENG"
              gambar="/jalanbareng.jpg"
              gambarCls="w-[120px] sm:w-[161px] lg:h-[309px] lg:w-[206px]"
            />
            <KartuPromo
              eyebrow="PERJALANAN BARENG KELUARGA, LEBIH HEMAT"
              baris1="Jalan Bareng Keluarga."
              baris2="Hemat hingga 15%."
              syarat="Min. sewa 7 hari."
              kode="SAMAKELUARGA"
              gambar="/promo-keluarga.jpg"
              gambarCls="w-[120px] sm:w-[161px] lg:h-[286px]"
            />
            {/* Kartu ke-3. Kalau sudah punya foto: taruh di public/ lalu tambahkan
                gambar="/promo-14hari.jpg" dan gambarCls="w-[120px] sm:w-[161px] lg:h-[286px]" */}
            <KartuPromo
              eyebrow="PERJALANAN PANJANG, LEBIH HEMAT"
              baris1="Jalan Jauh."
              baris2="Hemat hingga 20%."
              syarat="Min. sewa 14 hari."
              kode="JALANJAUH"
            />
          </div>
        </section>

        {/* ================= TIGA LANGKAH ================= */}
        <section className="flex flex-col gap-10 bg-[#f5f7f4] px-6 pb-20 pt-[72px] lg:px-20">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-[1.8px] text-[#087f6d]">NGGAK PAKAI RIBET</p>
            <h2 className="text-[30px] font-normal leading-[1.18] tracking-[-1.4px] text-[#172f2c] lg:text-[38px]">
              Tiga langkah. Langsung jalan.
            </h2>
          </div>

          <div className="flex flex-col gap-12 lg:flex-row">
            {LANGKAH.map((l) => (
              <div key={l.no} className="flex min-w-0 flex-1 flex-col gap-[18px]">
                <div className="flex items-center justify-between">
                  <span className="flex size-[52px] items-center justify-center rounded-2xl bg-white">
                    <Icon name={l.ikon} className="size-[25px] text-[#087f6d]" />
                  </span>
                  <p className="text-[36px] tracking-[-1px] text-[#087f6d]">{l.no}</p>
                </div>
                <p className="text-[19px] tracking-[-0.5px] text-[#172f2c]">{l.judul}</p>
                <p className="text-sm leading-[1.65] text-[#687773]">{l.isi}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter legal={sudahLogin} />
    </div>
  );
}

// ================= KARTU PROMO =================
function KartuPromo({ eyebrow, baris1, baris2, syarat, kode, gambar, gambarCls }) {
  return (
    <div className="flex h-[286px] w-full overflow-hidden rounded-3xl bg-[#103f37] lg:w-[656px] lg:shrink-0">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 p-8 lg:w-[450px] lg:flex-none">
        <p className="text-[11px] font-bold tracking-[1.5px] text-[#d7eb95]">{eyebrow}</p>

        <p className="text-[30px] font-normal leading-[1.15] tracking-[-1px] text-white">
          {baris1}
          <br />
          {baris2}
        </p>

        <p className="text-xs text-[#e7f3ec]">{syarat}</p>

        <div className="flex items-center gap-[14px]">
          <span className="rounded-md border border-dashed border-[#d7eb95] px-[14px] py-[10px] text-[13px] font-bold tracking-[1px] text-[#d7eb95]">
            {kode}
          </span>
          <Link href="/motor" className="whitespace-nowrap text-xs font-semibold text-white">
            Pakai promo →
          </Link>
        </div>
      </div>

      {gambar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={gambar} alt="" className={`h-full shrink-0 self-start object-cover ${gambarCls}`} />
      )}
    </div>
  );
}