import db from "../../../db";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const result = await db.query(
      `SELECT id, nama, email, password, role
       FROM users
       WHERE email = $1 AND password = $2`,
      [email, password]
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    return Response.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      { status: 500 }
    );
  }
}