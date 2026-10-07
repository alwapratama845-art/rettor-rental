import db from "../../../../db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const result = await db.query(
      `SELECT *
       FROM motor
       WHERE id = $1`,
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
      motor: result.rows[0],
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