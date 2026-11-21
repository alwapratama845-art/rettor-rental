import { prisma } from "../../../../lib/prisma.js";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const motor = await prisma.motor.findUnique({
      where: {
        id_motor: Number(id),
      },
    });

    if (!motor) {
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
      motor: {
        id: motor.id_motor,
        id_motor: motor.id_motor,
        nama: motor.nama_motor,
        nama_motor: motor.nama_motor,
        jenis: motor.jenis,
        cc: motor.cc,
        harga: motor.harga_per_hari.toString(),
        harga_per_hari: motor.harga_per_hari.toString(),
        gambar: motor.gambar,
      },
    });
  } catch (error) {
    console.error("GET DETAIL MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil detail motor.",
      },
      { status: 500 }
    );
  }
}
