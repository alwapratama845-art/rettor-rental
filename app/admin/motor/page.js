"use client";

import { useEffect, useState } from "react";

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

        {/* ================= HEADER ================= */}
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
              fontSize: "32px",
              color: "#111827",
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
            Kelola data motor RETTOR RENTAL
          </p>


          {/* NAVIGASI */}
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
                background: "#111827",
                color: "white",
                padding: "12px 18px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ← Kembali ke Admin
            </a>


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
              href="/"
              style={{
                background: "#374151",
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


        {/* ================= FORM ================= */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              color: "#111827",
              marginTop: 0,
              marginBottom: "8px",
            }}
          >
            {editId ? "✏️ Edit Motor" : "➕ Tambah Motor"}
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "25px",
            }}
          >
            {editId
              ? "Ubah data motor yang dipilih."
              : "Tambahkan motor baru ke RETTOR RENTAL."}
          </p>


          <form onSubmit={handleSubmit}>

            {/* GRID FORM */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "18px",
              }}
            >

              {/* NAMA */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Nama Motor
                </label>

                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Yamaha Fazzio"
                  required
                  style={inputStyle}
                />
              </div>


              {/* JENIS */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Jenis Motor
                </label>

                <select
                  value={jenis}
                  onChange={(e) => setJenis(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Matic">Matic</option>
                  <option value="Manual">Manual</option>
                  <option value="Sport">Sport</option>
                </select>
              </div>


              {/* CC */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  CC Motor
                </label>

                <input
                  type="number"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Contoh: 125"
                  required
                  style={inputStyle}
                />
              </div>


              {/* HARGA */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Harga Sewa / Hari
                </label>

                <input
                  type="number"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Contoh: 85000"
                  required
                  style={inputStyle}
                />
              </div>

            </div>


            {/* ================= FOTO ================= */}
            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >

              {/* UPLOAD */}
              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Foto Motor
                </label>

                <label
                  style={{
                    height: "200px",
                    border: "2px dashed #cbd5e1",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#fafafa",
                    padding: "20px",
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize: "42px",
                        marginBottom: "8px",
                      }}
                    >
                      📷
                    </div>

                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#111827",
                      }}
                    >
                      Klik untuk pilih foto
                    </div>

                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        marginTop: "6px",
                      }}
                    >
                      JPG, JPEG, PNG
                    </div>

                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      Maksimal 2 MB
                    </div>

                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    style={{
                      display: "none",
                    }}
                  />

                </label>

              </div>


              {/* PREVIEW */}
              <div>

                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Preview Foto
                </label>

                <div
                  style={{
                    height: "200px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview motor"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#9ca3af",
                      }}
                    >
                      Belum ada foto
                    </span>
                  )}

                </div>

              </div>

            </div>


            {/* ================= BUTTON ================= */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
              }}
            >

              <button
                type="submit"
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {editId
                  ? "💾 Simpan Perubahan"
                  : "➕ Tambah Motor"}
              </button>


              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "14px 25px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
              )}

            </div>

          </form>

        </div>


        {/* ================= DAFTAR MOTOR ================= */}
        <div
          style={{
            marginBottom: "15px",
          }}
        >

          <h2
            style={{
              color: "#111827",
              marginBottom: "5px",
            }}
          >
            🏍️ Daftar Motor
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Kelola motor yang tersedia di RETTOR RENTAL.
          </p>

        </div>


        {/* ================= LOADING ================= */}
        {loading ? (
          <div style={cardStyle}>
            Memuat data motor...
          </div>
        ) : motor.length === 0 ? (
          <div style={cardStyle}>
            Belum ada motor.
          </div>
        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >

            {motor.map((item) => (

              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.08)",
                }}
              >

                {/* FOTO MOTOR */}
                <div
                  style={{
                    height: "210px",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "60px",
                      }}
                    >
                      🏍️
                    </span>
                  )}

                </div>


                {/* DETAIL */}
                <div
                  style={{
                    padding: "20px",
                  }}
                >

                  <h3
                    style={{
                      margin: "0 0 10px",
                      color: "#111827",
                      fontSize: "20px",
                    }}
                  >
                    {item.nama}
                  </h3>


                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >

                    <span style={badgeStyle}>
                      {item.jenis}
                    </span>

                    <span style={badgeStyle}>
                      {item.cc}cc
                    </span>

                  </div>


                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#2563eb",
                      marginBottom: "18px",
                    }}
                  >
                    {formatRupiah(item.harga)}
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        fontWeight: "normal",
                      }}
                    >
                      {" "}
                      / hari
                    </span>
                  </div>


                  {/* BUTTON CRUD */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >

                    <button
                      onClick={() => mulaiEdit(item)}
                      style={{
                        flex: 1,
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        padding: "11px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>


                    <button
                      onClick={() =>
                        hapusMotor(item.id, item.nama)
                      }
                      style={{
                        flex: 1,
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "11px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Hapus
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}


// ==============================
// STYLE
// ==============================

const inputStyle = {
  width: "100%",
  padding: "13px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#111827",
  background: "white",
  boxSizing: "border-box",
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#6b7280",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};

const badgeStyle = {
  background: "#eff6ff",
  color: "#2563eb",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};