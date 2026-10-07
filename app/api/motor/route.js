import db from "../../../db";

// ==============================
// GET - TAMPILKAN SEMUA MOTOR
// ==============================
export async function GET() {
  try {
    const result = await db.query(
      `SELECT *
       FROM motor
       ORDER BY id DESC`
    );

    return Response.json({
      success: true,
      motor: result.rows,
    });
  } catch (error) {
    console.error("GET MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil data motor.",
      },
      { status: 500 }
    );
  }
}


// ==============================
// POST - TAMBAH MOTOR
// ==============================
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      nama,
      jenis,
      cc,
      harga,
      gambar,
    } = body;

    if (!nama || !jenis || !cc || !harga || !gambar) {
      return Response.json(
        {
          success: false,
          message: "Semua data motor wajib diisi.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `INSERT INTO motor
      (nama, jenis, cc, harga, gambar)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        nama,
        jenis,
        Number(cc),
        Number(harga),
        gambar,
      ]
    );

    return Response.json({
      success: true,
      message: "Motor berhasil ditambahkan.",
      motor: result.rows[0],
    });

  } catch (error) {
    console.error("POST MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menambahkan motor.",
      },
      { status: 500 }
    );
  }
}


// ==============================
// PUT - EDIT MOTOR
// ==============================
export async function PUT(request) {
  try {
    const body = await request.json();

    const {
      id,
      nama,
      jenis,
      cc,
      harga,
      gambar,
    } = body;

    if (!id || !nama || !jenis || !cc || !harga) {
      return Response.json(
        {
          success: false,
          message: "Data motor belum lengkap.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE motor
       SET
         nama = $1,
         jenis = $2,
         cc = $3,
         harga = $4,
         gambar = COALESCE($5, gambar)
       WHERE id = $6
       RETURNING *`,
      [
        nama,
        jenis,
        Number(cc),
        Number(harga),
        gambar || null,
        Number(id),
      ]
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Motor tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Motor berhasil diperbarui.",
      motor: result.rows[0],
    });

  } catch (error) {
    console.error("PUT MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui motor.",
      },
      { status: 500 }
    );
  }
}


// ==============================
// DELETE - HAPUS MOTOR
// ==============================
export async function DELETE(request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "ID motor wajib diisi.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `DELETE FROM motor
       WHERE id = $1
       RETURNING *`,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Motor tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Motor berhasil dihapus.",
    });

  } catch (error) {
    console.error("DELETE MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus motor.",
      },
      { status: 500 }
    );
  }
}