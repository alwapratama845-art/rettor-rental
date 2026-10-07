import db from "../../../db";

export async function POST(request) {
  try {
    const body = await request.json();

    const { nama, email, password } = body;

    if (!nama || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Semua data wajib diisi.",
        },
        { status: 400 }
      );
    }

    const cekUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (cekUser.rows.length > 0) {
      return Response.json(
        {
          success: false,
          message: "Email sudah terdaftar.",
        },
        { status: 400 }
      );
    }

    await db.query(
      "INSERT INTO users (nama, email, password) VALUES ($1, $2, $3)",
      [nama, email, password]
    );

    return Response.json({
      success: true,
      message: "Registrasi berhasil.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 }
    );
  }
}