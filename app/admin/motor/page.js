"use client";

import { useEffect, useState } from "react";
import { AdminShell, Icon } from "../../components/site";

export default function AdminMotorPage() {
  // =========================
  // DATA FORM
  // =========================
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("Matic");
  const [cc, setCc] = useState("");
  const [harga, setHarga] = useState("");
  const [gambar, setGambar] = useState("");
  const [preview, setPreview] = useState("");

  // =========================
  // DATA MOTOR
  // =========================
  const [motor, setMotor] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // MODE EDIT
  // =========================
  const [editId, setEditId] = useState(null);


  // =========================
  // AMBIL DATA MOTOR
  // =========================
  async function ambilMotor() {
    try {
      const response = await fetch("/api/motor");

      const data = await response.json();

      if (response.ok) {
        setMotor(data.motor || []);
      } else {
        alert(data.message || "Gagal mengambil data motor.");
      }

    } catch (error) {
      console.error(error);
      alert("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }


  // =========================
  // LOAD SAAT HALAMAN DIBUKA
  // =========================
  useEffect(() => {
    ambilMotor();
  }, []);


  // =========================
  // PILIH FOTO
  // =========================
  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setGambar(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }


  // =========================
  // TAMBAH / EDIT MOTOR
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!nama || !cc || !harga) {
      alert("Semua data wajib diisi.");
      return;
    }

    // =========================
    // TAMBAH
    // =========================
    if (!editId && !gambar) {
      alert("Silakan pilih foto motor.");
      return;
    }

    try {
      const response = await fetch("/api/motor", {
        method: editId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: editId,
          nama,
          jenis,
          cc,
          harga,
          gambar: gambar || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menyimpan motor.");
        return;
      }

      alert(
        editId
          ? "Motor berhasil diperbarui!"
          : "Motor berhasil ditambahkan!"
      );

      resetForm();

      ambilMotor();

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    }
  }


  // =========================
  // EDIT MOTOR
  // =========================
  function mulaiEdit(item) {
    setEditId(item.id);

    setNama(item.nama);
    setJenis(item.jenis);
    setCc(item.cc);
    setHarga(item.harga);

    setGambar(item.gambar || "");
    setPreview(item.gambar || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =========================
  // HAPUS MOTOR
  // =========================
  async function hapusMotor(id, namaMotor) {
    const yakin = confirm(
      `Apakah kamu yakin ingin menghapus motor "${namaMotor}"?`
    );

    if (!yakin) return;

    try {
      const response = await fetch("/api/motor", {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menghapus motor.");
        return;
      }

      alert("Motor berhasil dihapus.");

      ambilMotor();

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server.");
    }
  }


  // =========================
  // RESET FORM
  // =========================
  function resetForm() {
    setEditId(null);
    setNama("");
    setJenis("Matic");
    setCc("");
    setHarga("");
    setGambar("");
    setPreview("");
  }


  // =========================
  // FORMAT RUPIAH
  // =========================
  function formatRupiah(angka) {
    return `Rp${Number(angka || 0).toLocaleString("id-ID")}`;
  }


  return (
    <AdminShell tab="motor" judul="Motor terawat. Perjalanan hebat.">
      <div className="flex flex-col gap-10">

        {/* ================= FORM ================= */}
        <section className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[32px] font-normal leading-[1.2] tracking-[-1px] text-[#172f2c]">
                {editId ? "Edit Motor" : "Tambah Motor"}
              </h2>
              <p className="text-sm text-[#687773]">
                {editId
                  ? "Ubah data motor yang dipilih."
                  : "Tambahkan motor baru ke RETTOR RENTAL."}
              </p>
            </div>
            <span className="hidden text-[11px] font-bold tracking-[0.5px] text-[#087f6d] sm:mt-6 sm:inline">
              01 / INFORMASI MOTOR
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-[#dee5df] bg-white p-5 sm:p-[29px]"
          >
            {/* DETAIL MOTOR */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Nama Motor">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Yamaha Fazzio"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Jenis Motor">
                <div className="relative">
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
                    className={`${inputCls} appearance-none pr-11`}
                  >
                    <option value="Matic">Matic</option>
                    <option value="Manual">Manual</option>
                    <option value="Sport">Sport</option>
                  </select>
                  <Icon
                    name="chevron-down"
                    className="pointer-events-none absolute right-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#687773]"
                  />
                </div>
              </Field>

              <Field label="CC Motor">
                <input
                  type="number"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Contoh: 125"
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Harga Sewa / Hari">
                <input
                  type="number"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Contoh: 85000"
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {/* FOTO DAN PREVIEW */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Foto Motor">
                <label className="flex h-[208px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#c5d6cb] bg-[#f8faf7] p-5 text-center transition hover:border-[#087f6d]">
                  <Icon name="camera" className="mb-1 size-8 text-[#087f6d]" />
                  <span className="text-sm font-semibold text-[#087f6d]">Klik untuk pilih foto</span>
                  <span className="text-xs text-[#687773]">JPG, JPEG, PNG</span>
                  <span className="text-xs text-[#687773]">Maksimal 2 MB</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </Field>

              <Field label="Preview Foto">
                <div className="flex h-[208px] items-center justify-center overflow-hidden rounded-lg border border-[#dee5df] bg-[#f6f7f4]">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview motor" className="size-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                      <span className="text-sm text-[#687773]">Belum ada foto</span>
                      <span className="text-xs text-[#687773]">Preview foto motor akan tampil di sini.</span>
                    </div>
                  )}
                </div>
              </Field>
            </div>

            {/* AKSI */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#687773]">Pastikan informasi dan foto motor sudah sesuai.</p>

              <div className="flex gap-3">
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex h-[50px] items-center justify-center rounded-lg border border-[#dee5df] bg-white px-6 text-sm font-semibold text-[#172f2c] transition hover:bg-[#f8faf7]"
                  >
                    Batal
                  </button>
                )}

                <button
                  type="submit"
                  className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#087f6d] px-6 text-sm font-semibold text-white transition hover:bg-[#066b5c] sm:flex-none"
                >
                  <Icon name={editId ? "check" : "plus"} className="size-[18px]" />
                  {editId ? "Simpan Perubahan" : "Tambah Motor"}
                </button>
              </div>
            </div>
          </form>
        </section>


        {/* ================= DAFTAR MOTOR ================= */}
        <section className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-[32px] font-normal leading-[1.2] tracking-[-1px] text-[#172f2c]">Daftar Motor</h2>
              <p className="text-sm text-[#687773]">Kelola motor yang tersedia di RETTOR RENTAL.</p>
            </div>
            <span className="mt-4 hidden rounded-full bg-[#e7f3ec] px-3.5 py-2 text-[11px] font-bold text-[#087f6d] sm:inline">
              {motor.length} motor ditampilkan
            </span>
          </div>

          {loading ? (
            <div className={emptyCls}>Memuat data motor...</div>
          ) : motor.length === 0 ? (
            <div className={emptyCls}>Belum ada motor.</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {motor.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#dee5df] bg-white"
                >
                  {/* FOTO MOTOR */}
                  <div className="flex h-[225px] items-center justify-center bg-[#f9fafc]">
                    {item.gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.gambar} alt={item.nama} className="size-full object-contain" />
                    ) : (
                      <span className="text-sm text-[#687773]">Belum ada foto</span>
                    )}
                  </div>

                  {/* DETAIL */}
                  <div className="flex flex-col gap-4 p-5">
                    <h3 className="text-xl leading-[1.4] tracking-[-0.3px] text-[#172f2c]">{item.nama}</h3>

                    <div className="flex flex-wrap gap-2">
                      <span className={chipCls}>{item.jenis}</span>
                      <span className={chipCls}>{item.cc}cc</span>
                    </div>

                    <p className="flex items-baseline gap-1.5">
                      <span className="text-[26px] font-semibold leading-[1.2] tracking-[-0.5px] text-[#087f6d]">
                        {formatRupiah(item.harga)}
                      </span>
                      <span className="text-xs text-[#687773]">/ hari</span>
                    </p>

                    {/* TOMBOL CRUD */}
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => mulaiEdit(item)}
                        className="flex h-[43px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#e7f3ec] text-[13px] font-semibold text-[#087f6d] transition hover:bg-[#d8ecdf]"
                      >
                        <Icon name="pencil" className="size-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => hapusMotor(item.id, item.nama)}
                        className="flex h-[43px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#fceae7] text-[13px] font-semibold text-[#a34237] transition hover:bg-[#f8d9d4]"
                      >
                        <Icon name="trash-2" className="size-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && motor.length > 0 && (
            <p className="text-xs text-[#687773]">Menampilkan {motor.length} motor</p>
          )}
        </section>

      </div>
    </AdminShell>
  );
}


// ==============================
// STYLE & KOMPONEN KECIL
// ==============================

const inputCls =
  "h-[52px] w-full rounded-lg border border-[#dee5df] bg-white px-[17px] text-sm text-[#172f2c] placeholder:text-[#687773] focus:border-[#087f6d] focus:outline-none focus:ring-2 focus:ring-[#087f6d]/20";

const labelCls = "text-[13px] font-semibold leading-[1.4] text-[#172f2c]";

const chipCls =
  "rounded-full bg-[#e7f3ec] px-2.5 py-[5px] text-[11px] font-bold leading-4 text-[#087f6d]";

const emptyCls =
  "rounded-2xl border border-[#dee5df] bg-white p-10 text-center text-sm text-[#687773]";

function Field({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}