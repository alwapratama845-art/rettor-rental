"use client";

import { useEffect, useState } from "react";
import { Icon, AdminShell } from "../components/site";

const DEPOSIT_TETAP = 200000;

export default function AdminPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proses, setProses] = useState(null);
  const [cari, setCari] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // ================= DIALOG DI DALAM HALAMAN =================
  // Pengganti window.alert / confirm / prompt (tidak didukung di semua browser).
  const [dialog, setDialog] = useState(null);
  const [isiDialog, setIsiDialog] = useState("");

  function bukaDialog(opsi) {
    return new Promise((resolve) => {
      setIsiDialog("");
      setDialog({ ...opsi, resolve });
    });
  }

  // true / false
  const mintaKonfirmasi = (pesan) =>
    bukaDialog({ jenis: "konfirmasi", judul: "Konfirmasi", pesan, tombol: "Lanjutkan" });

  // teks / null (kalau dibatalkan)
  const mintaIsian = (pesan, judul, tombol = "Simpan") =>
    bukaDialog({ jenis: "isian", judul, pesan, tombol });

  // pemberitahuan, selesai saat ditutup
  const beriTahu = (pesan) =>
    bukaDialog({ jenis: "info", judul: "Pemberitahuan", pesan, tombol: "OK" });

  function tutupDialog(hasil) {
    if (dialog) dialog.resolve(hasil);
    setDialog(null);
  }

  // ================= DATA =================
  async function ambilPesanan() {
    try {
      const response = await fetch("/api/pesanan");
      const data = await response.json();

      if (response.ok) {
        setPesanan(data.pesanan || []);
      } else {
        await beriTahu(data.message || "Gagal mengambil data pesanan.");
      }
    } catch (error) {
      console.error(error);
      await beriTahu("Tidak dapat terhubung ke server.");
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

    if (!(await mintaKonfirmasi(konfirmasi))) return;

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
        await beriTahu(data.message || "Gagal mengubah status.");
        return;
      }

      await beriTahu(data.message);
      await ambilPesanan();
    } catch (error) {
      console.error(error);
      await beriTahu("Terjadi kesalahan server.");
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

    if (!(await mintaKonfirmasi(pesan))) return;

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
        await beriTahu(data.message || "Gagal mengubah deposit.");
        return;
      }

      await beriTahu(data.message);
      await ambilPesanan();
    } catch (error) {
      console.error(error);
      await beriTahu("Terjadi kesalahan server.");
    } finally {
      setProses(null);
    }
  }

  async function potongDeposit(id) {
    const alasan = await mintaIsian(
      "Masukkan alasan pemotongan deposit, misalnya biaya kerusakan motor:",
      "Potong deposit",
      "Lanjut"
    );

    if (alasan === null) return;

    if (!alasan.trim()) {
      await beriTahu("Alasan pemotongan wajib diisi.");
      return;
    }

    ubahStatusDeposit(id, "dipotong", alasan.trim());
  }

  function formatRupiah(angka) {
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
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

  const daftar = pesanan.filter((p) => {
    const q = cari.trim().toLowerCase().replace("#", "");
    const cocokStatus = filterStatus === "semua" || p.status === filterStatus;
    const cocokCari =
      !q ||
      String(p.nama || "").toLowerCase().includes(q) ||
      String(p.id).includes(q);
    return cocokStatus && cocokCari;
  });

  const filterList = [
    ["semua", "Semua status"],
    ["menunggu", "Menunggu"],
    ["disetujui", "Disetujui"],
    ["ditolak", "Ditolak"],
  ];

  const chipPesanan = {
    menunggu: ["Menunggu konfirmasi", "bg-[#fff3d4] text-[#8a5a12]"],
    disetujui: ["Disetujui", "bg-[#e7f3ec] text-[#087f6d]"],
    ditolak: ["Ditolak", "bg-[#fceae7] text-[#a34237]"],
  };

  const chipDeposit = {
    menunggu: "bg-[#fff3d4] text-[#8a5a12]",
    diterima: "bg-[#d7eb95] text-[#172f2c]",
    dikembalikan: "bg-white text-[#087f6d]",
    dipotong: "bg-[#fceae7] text-[#a34237]",
  };

  return (
    <AdminShell tab="pesanan">
      <div className="flex flex-col gap-6">
        {/* JUDUL */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2 leading-[1.45]">
            <h2 className="text-[26px] font-normal text-[#172f2c]">Kelola Pesanan</h2>
            <p className="text-sm text-[#687773]">Konfirmasi pesanan dan kelola uang deposit pelanggan.</p>
          </div>
          <span className="w-fit rounded-full bg-[#e7f3ec] px-[14px] py-2 text-xs font-semibold leading-[1.45] text-[#087f6d]">
            {daftar.length} pesanan ditampilkan
          </span>
        </div>

        {/* PENCARIAN DAN STATUS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[360px]">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#687773]" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama atau nomor pesanan"
              className="h-12 w-full rounded-lg border border-[#dee5df] bg-white pl-11 pr-4 text-[13px] text-[#172f2c] placeholder:text-[#687773] focus:border-[#087f6d] focus:outline-none focus:ring-2 focus:ring-[#087f6d]/20"
            />
          </div>

          {filterList.map(([nilai, label]) => (
            <button
              key={nilai}
              type="button"
              onClick={() => setFilterStatus(nilai)}
              className={`rounded-full px-[14px] py-2 text-xs font-semibold leading-[1.45] ${
                filterStatus === nilai ? "bg-[#087f6d] text-white" : "bg-white text-[#687773] hover:text-[#172f2c]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* DAFTAR PESANAN */}
        {loading ? (
          <div className={kotakKosong}>Memuat data pesanan...</div>
        ) : daftar.length === 0 ? (
          <div className={kotakKosong}>
            {pesanan.length === 0 ? "Belum ada pesanan." : "Tidak ada pesanan yang cocok."}
          </div>
        ) : (
          daftar.map((item) => {
            const statusDeposit = item.status_deposit || "menunggu";
            const jumlahDeposit = Number(item.jumlah_deposit ?? DEPOSIT_TETAP);
            const [labelStatus, kelasStatus] = chipPesanan[item.status] || chipPesanan.menunggu;

            return (
              <div key={item.id} className="flex flex-col gap-6 rounded-2xl border border-[#dee5df] bg-white p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xl font-semibold leading-[1.45] text-[#172f2c]">Pesanan #{item.id}</p>
                  <span className={`rounded-full px-[14px] py-2 text-xs font-semibold leading-[1.45] ${kelasStatus}`}>
                    {labelStatus}
                  </span>
                </div>

                <div className="grid gap-x-6 gap-y-[22px] sm:grid-cols-2 lg:grid-cols-4">
                  <Info label="Nama" value={item.nama} />
                  <Info label="Nomor HP" value={item.telepon} />
                  <Info label="Motor" value={item.motor} />
                  <Info label="Harga / Hari" value={formatRupiah(item.harga_per_hari)} />

                  <Info label="Tanggal Mulai" value={item.tanggal_mulai} kecil />
                  <Info label="Tanggal Selesai" value={item.tanggal_selesai} kecil />
                  <Info label="Tanggal Kembali" value={item.tanggal_kembali || "Belum dikembalikan"} kecil />
                  <Info label="Lama Sewa" value={`${item.jumlah_hari || 0} hari`} />

                  <Info label="Diskon" value={`${item.persen_diskon || 0}%`} />
                  <Info label="Potongan Harga" value={formatRupiah(item.jumlah_diskon)} />
                  <Info label="Keterlambatan" value={`${item.hari_terlambat || 0} hari`} />
                  <Info label="Denda" value={formatRupiah(item.denda)} />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f6f3ea] px-5 py-[18px]">
                  <p className="text-sm font-semibold text-[#172f2c]">Total Harga Sewa</p>
                  <p className="text-2xl font-bold text-[#087f6d]">{formatRupiah(item.total_harga)}</p>
                </div>

                {/* DEPOSIT */}
                <div className="flex flex-col items-start gap-3 rounded-xl bg-[#e7f3ec] p-[22px]">
                  <div className="flex w-full items-center justify-between gap-3">
                    <p className="text-base font-semibold leading-[1.45] text-[#172f2c]">Deposit Jaminan</p>
                    <span className={`rounded-full px-[14px] py-2 text-xs font-semibold leading-[1.45] ${chipDeposit[statusDeposit] || chipDeposit.menunggu}`}>
                      {labelDeposit(statusDeposit)}
                    </span>
                  </div>

                  <p className="text-2xl font-bold leading-[1.45] text-[#087f6d]">{formatRupiah(jumlahDeposit)}</p>
                  <p className="text-sm leading-[1.45] text-[#687773]">Deposit tetap yang menjadi jaminan selama penyewaan.</p>

                  {item.catatan_deposit && (
                    <div className="w-full rounded-lg bg-white p-3 text-sm text-[#172f2c]">
                      <strong>Catatan Admin:</strong>
                      <p className="mt-1.5">{item.catatan_deposit}</p>
                    </div>
                  )}

                  {statusDeposit === "menunggu" && (
                    <button
                      disabled={proses !== null}
                      onClick={() => ubahStatusDeposit(item.id, "diterima")}
                      className={btnHijau}
                    >
                      Terima Deposit
                    </button>
                  )}

                  {statusDeposit === "diterima" && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={proses !== null}
                        onClick={() => ubahStatusDeposit(item.id, "dikembalikan")}
                        className={btnHijau}
                      >
                        Kembalikan Deposit
                      </button>
                      <button
                        disabled={proses !== null}
                        onClick={() => potongDeposit(item.id)}
                        className={btnMerah}
                      >
                        Potong Deposit
                      </button>
                    </div>
                  )}

                  {statusDeposit === "dikembalikan" && (
                    <p className="text-sm font-semibold leading-[1.45] text-[#087f6d]">
                      ✓ Deposit sudah dikembalikan kepada pelanggan.
                    </p>
                  )}

                  {statusDeposit === "dipotong" && (
                    <p className="text-sm font-semibold leading-[1.45] text-[#a34237]">
                      Deposit sudah ditandai dipotong.
                    </p>
                  )}
                </div>

                {item.status === "menunggu" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={proses !== null}
                      onClick={() => ubahStatus(item.id, "disetujui")}
                      className={btnHijau}
                    >
                      Konfirmasi Pesanan
                    </button>
                    <button
                      disabled={proses !== null}
                      onClick={() => ubahStatus(item.id, "ditolak")}
                      className={btnMerah}
                    >
                      Tolak Pesanan
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="flex flex-col justify-between gap-1 text-xs leading-[1.45] text-[#687773] sm:flex-row">
          <p>
            Menampilkan {daftar.length} pesanan
            {daftar.length > 0 && ` • ${daftar.slice(0, 6).map((p) => `#${p.id}`).join(", ")}${daftar.length > 6 ? ", ..." : ""}`}
          </p>
          <p>Tanggal ditampilkan dalam format asli (UTC).</p>
        </div>
      </div>

      {/* ================= DIALOG ================= */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-2xl bg-white p-6">
            <p className="text-[20px] tracking-[-0.5px] text-[#172f2c]">{dialog.judul}</p>
            <p className="text-sm leading-[1.55] text-[#687773]">{dialog.pesan}</p>

            {dialog.jenis === "isian" && (
              <textarea
                autoFocus
                value={isiDialog}
                onChange={(e) => setIsiDialog(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#dee5df] p-3 text-sm text-[#172f2c] outline-none focus:border-[#087f6d]"
              />
            )}

            <div className="flex justify-end gap-3">
              {dialog.jenis !== "info" && (
                <button
                  type="button"
                  onClick={() => tutupDialog(dialog.jenis === "isian" ? null : false)}
                  className={`${btnDasar} border border-[#dee5df] bg-white text-[#172f2c]`}
                >
                  Batal
                </button>
              )}
              <button
                type="button"
                disabled={dialog.jenis === "isian" && !isiDialog.trim()}
                onClick={() => tutupDialog(dialog.jenis === "isian" ? isiDialog : true)}
                className={dialog.jenis === "isian" ? btnMerah : btnHijau}
              >
                {dialog.tombol}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

const kotakKosong =
  "rounded-2xl border border-[#dee5df] bg-white p-10 text-center text-sm text-[#687773]";

const btnDasar =
  "flex h-12 items-center justify-center rounded-lg px-[22px] text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
const btnHijau = `${btnDasar} bg-[#087f6d] text-white hover:bg-[#066b5c]`;
const btnMerah = `${btnDasar} border border-[#ebcdc6] bg-[#fceae7] text-[#a34237] hover:bg-[#f8ddd8]`;

function Info({ label, value, kecil }) {
  return (
    <div className="flex min-w-0 flex-col gap-[7px] leading-[1.45]">
      <p className="text-xs text-[#687773]">{label}</p>
      <p className={`break-words font-semibold text-[#172f2c] ${kecil ? "text-xs" : "text-sm"}`}>
        {value || "-"}
      </p>
    </div>
  );
}