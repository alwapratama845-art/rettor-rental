import { prisma } from "../../../lib/prisma.js";

export async function POST(request) {
  try {
    const { nama, email, password } = await request.json();

    if (!nama || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Semua data wajib diisi.",
        },
        { status: 400 }
      );
    }

    const cekUser = await prisma.users.findUnique({
      where: { email },
    });

    if (cekUser) {
      return Response.json(
        {
          success: false,
          message: "Email sudah terdaftar.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.create({
      data: {
        nama,
        email,
        password,
        role: "user",
      },
      select: {
        id_users: true,
        nama: true,
        email: true,
        role: true,
      },
    });

    return Response.json({
      success: true,
      message: "Registrasi berhasil.",
      user: {
        ...user,
        id: user.id_users,
      },
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