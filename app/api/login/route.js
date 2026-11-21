import { prisma } from "../../../lib/prisma.js";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        email,
        password,
      },
      select: {
        id_users: true,
        nama: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id_users,
        id_users: user.id_users,
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
