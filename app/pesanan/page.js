"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { inter, Icon, SiteNav, SiteFooter } from "../components/site";

const KUNING = "bg-[#f6f3ea] text-[#ae781f]";

const STATUS_PESANAN = {
  disetujui: { label: "Disetujui", cls: "bg-[#e7f3ec] text-[#087f6d]" },
  ditolak: { label: "Ditolak", cls: "bg-[#ffe9ea] text-[#ff383c]" },
  menunggu: { label: "Menunggu", cls: KUNING },
};

const STATUS_DEPOSIT = {
  menunggu: { label: "Menunggu pembayaran", cls: KUNING },
  diterima: { label: "Sudah diterima admin", cls: "bg-[#e7f3ec] text-[#087f6d]" },
  dikembalikan: { label: "Sudah dikembalikan", cls: "bg-[#103f37] text-[#d7eb95]" },
  dipotong: { label: "Deposit dipotong", cls: "bg-[#ffe9ea] text-[#ff383c]" },
};

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

    try {
      const userData = JSON.parse(dataUser);
      setUser(userData);
      ambilPesanan(userData.id);
    } catch (error) {
      localStorage.removeItem("rettor_user");
      window.location.href = "/login";
    }
  }, []);

  const ambilPesanan = async (userId) => {
    try {
      const response = await fetch(`/api/pesanan?user_id=${userId}`);
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

  const formatRupiah = (angka) => `Rp${Number(angka || 0).toLocaleString("id-ID")}`;

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  if (loading || !user) {
    return (
      <div className={`${inter.className} flex min-h-screen items-center justify-center bg-white`}>
        <p className="text-sm text-[#687773]">Memuat pesanan...</p>
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <SiteNav nama={user.nama} login aktif="pesanan" />

      <main className="flex-1 leading-[normal]">
        {/* ================= HERO ================= */}
        <HeroHalaman baris1="Pesanan" baris2="Saya" />

        {/* ================= DAFTAR PESANAN ================= */}
        <section className="flex flex-col gap-9 px-6 pb-[72px] pt-14 lg:px-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-[#087f6d]">Lihat daftar riwayat pesanan sewa</p>
              <h2 className="text-[30px] font-normal leading-[1.18] tracking-[-1.4px] text-[#172f2c] lg:text-[38px]">
                Daftar Pesanan
              </h2>
            </div>

            <Link href="/motor" className="flex shrink-0 items-center gap-2 pb-1.5 text-sm text-[#087f6d]">
              Lihat semua motor
              <Icon name="arrow-right" className="size-[18px]" />
            </Link>
          </div>

          {pesanan.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 bg-[#f6f3ea] px-6 py-16 text-center lg:h-[264px] lg:py-0">
              <p className="text-[11px] font-bold text-[#087f6d]">Kamu belum menyewa motor</p>
              <p className="text-[28px] font-normal tracking-[-0.5px] text-[#172f2c] lg:text-[32px]">
                Belum ada pesanan
              </p>
              <Link
                href="/motor"
                className="flex h-11 items-center rounded-xl bg-white px-6 text-[13px] font-semibold text-[#172f2c]"
              >
                Sewa Motor
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {pesanan.map((item) => {
                const deposit = Number(item.jumlah_deposit ?? 200000);
                const statusDeposit = item.status_deposit || "menunggu";
                const sp = STATUS_PESANAN[item.status] || { label: item.status || "Menunggu", cls: KUNING };
                const sd = STATUS_DEPOSIT[statusDeposit] || STATUS_DEPOSIT.menunggu;

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border border-[#dee5df] bg-white p-6"
                  >
                    {/* HEADER */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-col gap-[7px]">
                        <p className="text-[20px] tracking-[-0.5px] text-[#172f2c]">{item.motor}</p>
                        <p className="text-xs text-[#687773]">Pesanan #{item.id}</p>
                      </div>
                      <span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize ${sp.cls}`}>
                        {sp.label}
                      </span>
                    </div>

                    {/* DETAIL SEWA */}
                    <div className="grid grid-cols-2 gap-5 rounded-2xl bg-[#f5f7f4] p-5">
                      <Detail label="Tanggal mulai">{formatTanggal(item.tanggal_mulai)}</Detail>
                      <Detail label="Tanggal selesai">{formatTanggal(item.tanggal_selesai)}</Detail>
                      <Detail label="Jumlah hari">{item.jumlah_hari} hari</Detail>
                      <Detail label="Total biaya sewa">
                        <span className="text-[#087f6d]">{formatRupiah(item.total_harga)}</span>
                      </Detail>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#687773]">Tanggal pengembalian</span>
                      <span className="font-semibold text-[#172f2c]">{formatTanggal(item.tanggal_kembali)}</span>
                    </div>

                    <div className="h-px w-full bg-[#dee5df]" />

                    {/* DEPOSIT */}
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon name="shield-check" className="size-[18px] text-[#087f6d]" />
                          <p className="text-sm font-semibold text-[#172f2c]">Jaminan deposit</p>
                        </div>
                        <span className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${sd.cls}`}>
                          {sd.label}
                        </span>
                      </div>

                      <p className="text-[22px] font-bold tracking-[-0.7px] text-[#172f2c]">
                        {formatRupiah(deposit)}
                      </p>

                      <p className="text-xs leading-[1.65] text-[#687773]">
                        Deposit adalah uang jaminan yang terpisah dari biaya sewa. Deposit dikembalikan setelah motor
                        diperiksa admin sesuai ketentuan penyewaan.
                      </p>

                      {item.catatan_deposit && (
                        <div className="rounded-lg bg-[#f6f3ea] p-3 text-xs leading-[1.65] text-[#172f2c]">
                          <span className="font-semibold">Catatan admin: </span>
                          {item.catatan_deposit}
                        </div>
                      )}
                    </div>

                    {/* RINGKASAN PEMBAYARAN */}
                    <div className="flex flex-col gap-3 rounded-2xl bg-[#103f37] p-5">
                      <p className="text-sm font-semibold text-white">Ringkasan pembayaran</p>

                      <div className="flex items-center justify-between gap-3 text-xs text-[#e7f3ec]">
                        <span>Biaya sewa</span>
                        <span className="font-semibold text-white">{formatRupiah(item.total_harga)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-xs text-[#e7f3ec]">
                        <span>Deposit jaminan</span>
                        <span className="font-semibold text-white">{formatRupiah(deposit)}</span>
                      </div>

                      <div className="h-px w-full bg-white/15" />

                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs text-[#e7f3ec]">Total pembayaran awal</span>
                        <span className="text-[20px] font-bold tracking-[-0.5px] text-[#d7eb95]">
                          {formatRupiah(Number(item.total_harga || 0) + deposit)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-[11px] text-[#687773]">{label}</p>
      <p className="text-sm font-semibold text-[#172f2c]">{children}</p>
    </div>
  );
}

// Hero krem: judul di kiri, foto di kanan (sama seperti Beranda).
function HeroHalaman({ baris1, baris2 }) {
  return (
    <section className="flex flex-col bg-[#f6f3ea] px-6 pb-8 lg:h-[330px] lg:flex-row lg:px-20 lg:pb-0">
      <div className="flex flex-col items-start gap-6 pb-8 pt-[52px] lg:w-[308px] lg:shrink-0 lg:pb-0">
        <div className="flex items-center gap-2">
          <span className="size-[7px] rounded-full bg-[#087f6d]" />
          <p className="text-xs font-bold tracking-[1.5px] text-[#087f6d]">DKI Jakarta</p>
        </div>

        <h1 className="text-[44px] font-normal leading-[1.07] tracking-[-2px] text-[#172f2c] lg:text-[62px] lg:tracking-[-3px]">
          {baris1}
          <br />
          {baris2}
        </h1>
      </div>

      <div className="relative min-h-[240px] flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/login-hero.png" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />

        <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white px-[14px] py-[10px]">
          <Icon name="map-pin" className="size-4 text-[#087f6d]" />
          <p className="whitespace-nowrap text-xs font-semibold text-[#172f2c]">DKI Jakarta</p>
        </div>
      </div>
    </section>
  );
}