import db from "../../../db";

// GET - Ambil pesanan
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    let result;

    if (userId) {
      result = await db.query(
        `SELECT *
         FROM pesanan
         WHERE user_id = $1
         ORDER BY id DESC`,
        [Number(userId)]
      );
    } else {
      // Untuk ADMIN: tampilkan semua pesanan
      result = await db.query(
        `SELECT *
         FROM pesanan
         ORDER BY id DESC`
      );
    }

    return Response.json({
      success: true,
      pesanan: result.rows,
    });
  } catch (error) {
    console.error("GET PESANAN ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data pesanan.",
      },
      { status: 500 }
    );
  }
}


// POST - Simpan pesanan
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      user_id,
      nama,
      telepon,
      motor,
      harga_per_hari,
      persen_diskon,
      jumlah_diskon,
      tanggal_mulai,
      tanggal_selesai,
      tanggal_kembali,
      jumlah_hari,
      hari_terlambat,
      denda,
      total_harga,
    } = body;

    if (
      !user_id ||
      !nama ||
      !telepon ||
      !motor ||
      !tanggal_mulai ||
      !tanggal_selesai ||
      !tanggal_kembali
    ) {
      return Response.json(
        {
          success: false,
          message: "Semua data wajib diisi.",
        },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO pesanan
      (
        user_id,
        nama,
        telepon,
        motor,
        harga_per_hari,
        persen_diskon,
        jumlah_diskon,
        tanggal_mulai,
        tanggal_selesai,
        tanggal_kembali,
        jumlah_hari,
        hari_terlambat,
        denda,
        total_harga,
        status
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        'menunggu'
      )`,
      [
        Number(user_id),
        nama,
        telepon,
        motor,
        Number(harga_per_hari),
        Number(persen_diskon) || 0,
        Number(jumlah_diskon) || 0,
        tanggal_mulai,
        tanggal_selesai,
        tanggal_kembali,
        Number(jumlah_hari),
        Number(hari_terlambat) || 0,
        Number(denda) || 0,
        Number(total_harga),
      ]
    );

    return Response.json({
      success: true,
      message: "Penyewaan berhasil diajukan.",
    });
  } catch (error) {
    console.error("POST PESANAN ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menyimpan pesanan.",
      },
      { status: 500 }
    );
  }
}


// PUT - Konfirmasi / Tolak pesanan
export async function PUT(request) {
  try {
    const body = await request.json();

    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        {
          success: false,
          message: "ID dan status wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!["menunggu", "disetujui", "ditolak"].includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Status tidak valid.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE pesanan
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, Number(id)]
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Pesanan tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message:
        status === "disetujui"
          ? "Pesanan berhasil dikonfirmasi."
          : status === "ditolak"
          ? "Pesanan berhasil ditolak."
          : "Status berhasil diubah.",
      pesanan: result.rows[0],
    });
  } catch (error) {
    console.error("PUT PESANAN ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengubah status pesanan.",
      },
      { status: 500 }
    );
  }
}