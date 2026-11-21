"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { inter, Icon, SiteNav, SiteFooter } from "../components/site";

// ================= KONFIGURASI =================
const PER_HALAMAN = 12;
const KOTA = "DKI Jakarta";

// Label kecil di foto hanya untuk 4 motor pertama (sesuai Figma).
const LABEL_KARTU = ["Paling laris", "Nyaman berdua", "Gesit di kota", "Jalan lebih gaya"];

const KATEGORI = [
  { id: "semua", label: "Semua motor", ikon: "bike" },
  { id: "matic", label: "Matic" },
  { id: "vespa", label: "Vespa" },
  { id: "manual", label: "Manual" },
  { id: "listrik", label: "Listrik" },
];

const OPSI_KAPASITAS = [
  { id: "semua", label: "Kapasitas mesin" },
  { id: "kecil", label: "Di bawah 125 cc" },
  { id: "sedang", label: "125 – 150 cc" },
  { id: "besar", label: "Di atas 150 cc" },
];

const OPSI_HARGA = [
  { id: "semua", label: "Harga per hari" },
  { id: "murah", label: "Di bawah Rp100.000" },
  { id: "sedang", label: "Rp100.000 – Rp150.000" },
  { id: "mahal", label: "Di atas Rp150.000" },
];

const OPSI_URUTAN = [
  { id: "terbaru", label: "Paling terbaru" },
  { id: "murah", label: "Harga terendah" },
  { id: "mahal", label: "Harga tertinggi" },
  { id: "nama", label: "Nama A–Z" },
];

// ================= FUNGSI FILTER =================
function merekDari(item) {
  return String(item.nama || "").trim().split(/\s+/)[0] || "";
}

function cocokKategori(item, id) {
  const nama = String(item.nama || "").toLowerCase();
  const jenis = String(item.jenis || "").toLowerCase();

  if (id === "matic") return jenis === "matic";
  if (id === "vespa") return nama.includes("vespa");
  if (id === "manual") return jenis === "manual" || jenis === "sport";
  if (id === "listrik") return jenis === "listrik" || nama.includes("listrik");
  return true;
}

function cocokKapasitas(item, id) {
  const cc = Number(item.cc || 0);

  if (id === "kecil") return cc < 125;
  if (id === "sedang") return cc >= 125 && cc <= 150;
  if (id === "besar") return cc > 150;
  return true;
}

function cocokHarga(item, id) {
  const harga = Number(item.harga || 0);

  if (id === "murah") return harga < 100000;
  if (id === "sedang") return harga >= 100000 && harga <= 150000;
  if (id === "mahal") return harga > 150000;
  return true;
}

export default function MotorPage() {
  const [motorList, setMotorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // draft = isi kolom ketik, kataKunci = yang sudah dipakai untuk mencari
  const [draft, setDraft] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [kategori, setKategori] = useState("semua");
  const [merek, setMerek] = useState("semua");
  const [kapasitas, setKapasitas] = useState("semua");
  const [harga, setHarga] = useState("semua");
  const [urutan, setUrutan] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);

  // ================= AMBIL DATA =================
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("rettor_user") || "null"));
    } catch (error) {
      console.error("USER ERROR:", error);
    }

    const ambilMotor = async () => {
      try {
        const response = await fetch("/api/motor");
        const data = await response.json();

        if (data.success) {
          setMotorList(data.motor || []);
        }
      } catch (error) {
        console.error("Gagal mengambil motor:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilMotor();
  }, []);

  // Setiap filter berubah, kembali ke halaman 1.
  useEffect(() => {
    setHalaman(1);
  }, [kataKunci, kategori, merek, kapasitas, harga, urutan]);

  const formatRupiah = (angka) => `Rp${Number(angka || 0).toLocaleString("id-ID")}`;

  const daftarMerek = useMemo(
    () => [...new Set(motorList.map(merekDari).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [motorList]
  );

  const hasil = useMemo(() => {
    const kunci = kataKunci.trim().toLowerCase();

    const disaring = motorList.filter((item) => {
      if (kunci && !String(item.nama || "").toLowerCase().includes(kunci)) return false;
      if (merek !== "semua" && merekDari(item) !== merek) return false;
      return cocokKategori(item, kategori) && cocokKapasitas(item, kapasitas) && cocokHarga(item, harga);
    });

    const urut = [...disaring];

    if (urutan === "murah") urut.sort((a, b) => Number(a.harga) - Number(b.harga));
    else if (urutan === "mahal") urut.sort((a, b) => Number(b.harga) - Number(a.harga));
    else if (urutan === "nama") urut.sort((a, b) => String(a.nama).localeCompare(String(b.nama)));
    else urut.sort((a, b) => Number(b.id) - Number(a.id));

    return urut;
  }, [motorList, kataKunci, kategori, merek, kapasitas, harga, urutan]);

  const total = hasil.length;
  const totalHalaman = Math.max(1, Math.ceil(total / PER_HALAMAN));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const awal = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = hasil.slice(awal, awal + PER_HALAMAN);

  const adaFilter =
    kataKunci || kategori !== "semua" || merek !== "semua" || kapasitas !== "semua" || harga !== "semua";

  function cari(e) {
    e.preventDefault();
    setKataKunci(draft);
  }

  function resetFilter() {
    setDraft("");
    setKataKunci("");
    setKategori("semua");
    setMerek("semua");
    setKapasitas("semua");
    setHarga("semua");
  }

  function gantiHalaman(n) {
    if (n < 1 || n > totalHalaman) return;
    setHalaman(n);
    document.getElementById("daftar-motor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={user?.nama} login={Boolean(user)} admin={user?.role === "admin"} aktif="motor" />

      <main className="flex-1 leading-[normal]">
        {/* ================= HERO ================= */}
        <section className="relative flex flex-col gap-4 bg-[#f6f3ea] px-6 pb-9 pt-7 lg:h-[194px] lg:px-20 lg:pb-0">
          <div className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-[#687773]">Beranda</Link>
            <Icon name="chevron-right" className="size-3 text-[#687773]" />
            <span className="font-medium text-[#087f6d]">Daftar Motor</span>
          </div>

          <h1 className="text-[34px] font-normal leading-[1.1] tracking-[-1.5px] text-[#172f2c] lg:text-[44px]">
            Temukan teman jalanmu.
          </h1>

          <p className="max-w-[520px] text-[15px] leading-[1.5] text-[#687773]">
            Dari urusan harian sampai liburan, ada motor yang pas untuk setiap rencana.
          </p>

          <div className="flex w-fit items-center gap-2 rounded-full bg-white px-[14px] py-[10px] lg:absolute lg:bottom-6 lg:right-20">
            <Icon name="map-pin" className="size-4 text-[#087f6d]" />
            <p className="whitespace-nowrap text-xs font-semibold text-[#172f2c]">{KOTA}</p>
          </div>
        </section>

        {/* ================= PENCARIAN & FILTER ================= */}
        <section className="flex flex-col gap-6 px-6 pb-[72px] pt-8 lg:px-20">
          <form onSubmit={cari} className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Icon
                name="search"
                className="pointer-events-none absolute left-5 top-1/2 size-[18px] -translate-y-1/2 text-[#687773]"
              />
              <input
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (e.target.value === "") setKataKunci("");
                }}
                placeholder="Cari nama atau merek motor"
                className="h-[52px] w-full rounded-xl border border-[#dee5df] bg-white pl-12 pr-4 text-sm text-[#172f2c] outline-none placeholder:text-[#687773] focus:border-[#087f6d]"
              />
            </div>

            <Pilihan nilai={KOTA} onChange={() => {}} tinggi="h-[52px]" kiri className="w-full lg:w-[261px]">
              <option value={KOTA}>{KOTA}</option>
            </Pilihan>

            <button
              type="submit"
              className="flex h-[52px] cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#087f6d] whitespace-nowrap px-6 text-sm font-semibold text-white lg:min-w-[143px]"
            >
              Cari motor
              <Icon name="search" className="size-4" />
            </button>
          </form>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {KATEGORI.map((k) => {
                const aktif = kategori === k.id;

                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKategori(k.id)}
                    className={`flex h-[43px] shrink-0 cursor-pointer items-center gap-2 rounded-full border px-5 text-[13px] ${
                      aktif
                        ? "border-[#087f6d] bg-[#e7f3ec] font-semibold text-[#087f6d]"
                        : "border-[#f5f7f4] bg-[#f5f7f4] text-[#687773]"
                    }`}
                  >
                    {k.ikon && <Icon name={k.ikon} className="size-4" />}
                    {k.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Pilihan nilai={merek} onChange={setMerek} className="w-full sm:w-[143px]">
                <option value="semua">Semua merek</option>
                {daftarMerek.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Pilihan>

              <Pilihan nilai={kapasitas} onChange={setKapasitas} className="w-full sm:w-[160px]">
                {OPSI_KAPASITAS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </Pilihan>

              <Pilihan nilai={harga} onChange={setHarga} className="w-full sm:w-[160px]">
                {OPSI_HARGA.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </Pilihan>
            </div>
          </div>

          <div className="h-px w-full bg-[#dee5df]" />

          {/* ================= JUDUL DAFTAR + URUTAN ================= */}
          <div id="daftar-motor" className="flex scroll-mt-6 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[24px] font-normal tracking-[-0.5px] text-[#172f2c]">
                {kategori === "semua" ? "Semua motor" : KATEGORI.find((k) => k.id === kategori)?.label}
              </h2>
              <p className="text-xs text-[#687773]">
                {total === 0
                  ? "Tidak ada motor yang cocok"
                  : `Menampilkan ${awal + 1}–${awal + tampil.length} dari ${total} motor pilihan`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#687773]">Urutkan:</span>
              <Pilihan nilai={urutan} onChange={setUrutan} className="w-[170px] sm:w-[190px]">
                {OPSI_URUTAN.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </Pilihan>
            </div>
          </div>

          {/* ================= KATALOG ================= */}
          {loading ? (
            <div className="rounded-2xl border border-[#dee5df] p-10 text-center text-sm text-[#687773]">
              Memuat data motor...
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#dee5df] p-10 text-center">
              <p className="text-sm text-[#687773]">
                {motorList.length === 0 ? "Belum ada motor." : "Belum ada motor yang cocok dengan pencarianmu."}
              </p>
              {adaFilter && (
                <button
                  type="button"
                  onClick={resetFilter}
                  className="flex h-10 cursor-pointer items-center rounded-lg bg-[#e7f3ec] px-5 text-[13px] font-semibold text-[#087f6d]"
                >
                  Reset filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tampil.map((item, i) => {
                const label = LABEL_KARTU[awal + i];
                const gambar = item.gambar;
                const adaFoto =
                  gambar && (gambar.startsWith("data:image") || gambar.startsWith("http") || gambar.startsWith("/"));

                return (
                  <div
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#dee5df] bg-white"
                  >
                    {/* FOTO */}
                    <div className="relative flex h-[224px] w-full items-center justify-center overflow-hidden bg-white">
                      {adaFoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={gambar} alt={item.nama} className="size-full object-contain" />
                      ) : (
                        <span className="text-[80px]">{gambar || "🏍️"}</span>
                      )}

                      {label && (
                        <div className="absolute left-[14px] top-[14px] rounded-lg bg-white px-[9px] py-1.5">
                          <p className="whitespace-nowrap text-[10px] font-semibold text-[#087f6d]">{label}</p>
                        </div>
                      )}
                    </div>

                    {/* INFORMASI */}
                    <div className="flex flex-col gap-[14px] p-5">
                      <div className="flex items-center gap-1">
                        <Icon name="map-pin" className="size-[13px] text-[#687773]" />
                        <p className="whitespace-nowrap text-[11px] text-[#687773]">Cakung, Jakarta</p>
                      </div>

                      <div className="flex flex-col gap-[9px]">
                        <p className="text-[20px] tracking-[-0.5px] text-[#172f2c]">{item.nama}</p>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="rounded bg-[#e7f3ec] px-2 py-1 text-[10px] font-semibold capitalize text-[#087f6d]">
                            {item.jenis}
                          </span>
                          <p className="text-[11px] text-[#687773]">{item.cc} cc · 2 helm termasuk</p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-[#dee5df]" />

                      <div className="flex flex-col gap-[5px] whitespace-nowrap">
                        <p className="text-[11px] text-[#687773]">Mulai dari</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-[22px] font-bold tracking-[-0.7px] text-[#172f2c]">
                            {formatRupiah(item.harga)}
                          </p>
                          <p className="text-xs text-[#687773]">/ hari</p>
                        </div>
                      </div>

                      <Link
                        href={`/motor/${item.id}`}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e7f3ec] text-[13px] font-semibold text-[#087f6d]"
                      >
                        Lihat Detail
                        <Icon name="arrow-up-right" className="size-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CATATAN */}
          <div className="flex items-start justify-center gap-[7px]">
            <Icon name="info" className="size-[14px] shrink-0 text-[#687773]" />
            <p className="text-xs text-[#687773]">Baca ketentuan sewa sebelum mensewa</p>
          </div>

          {/* ================= PAGINASI ================= */}
          {total > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#687773]">
                Halaman {halamanAktif} dari {totalHalaman}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={halamanAktif === 1}
                  onClick={() => gantiHalaman(halamanAktif - 1)}
                  className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#dee5df] bg-white px-4 text-xs text-[#172f2c] disabled:cursor-not-allowed disabled:text-[#687773] disabled:opacity-50"
                >
                  <Icon name="chevron-left" className="size-3.5" />
                  Sebelumnya
                </button>

                {Array.from({ length: totalHalaman }, (_, n) => n + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => gantiHalaman(n)}
                    className={`flex size-10 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold ${
                      n === halamanAktif
                        ? "border-[#087f6d] bg-[#087f6d] text-white"
                        : "border-[#dee5df] bg-white text-[#172f2c]"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={halamanAktif === totalHalaman}
                  onClick={() => gantiHalaman(halamanAktif + 1)}
                  className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#dee5df] bg-white px-4 text-xs text-[#172f2c] disabled:cursor-not-allowed disabled:text-[#687773] disabled:opacity-50"
                >
                  Selanjutnya
                  <Icon name="chevron-right" className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

// Dropdown bergaya Rettor (select bawaan browser + ikon panah).
function Pilihan({ nilai, onChange, children, className = "", tinggi = "h-11", kiri = false }) {
  return (
    <div className={`relative ${className}`}>
      {kiri && (
        <Icon
          name="map-pin"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087f6d]"
        />
      )}
      <select
        value={nilai}
        onChange={(e) => onChange(e.target.value)}
        className={`${tinggi} w-full cursor-pointer appearance-none rounded-lg border border-[#dee5df] bg-white text-[13px] text-[#172f2c] outline-none focus:border-[#087f6d] ${
          kiri ? "pl-11" : "pl-4"
        } pr-10`}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#687773]"
      />
    </div>
  );
}