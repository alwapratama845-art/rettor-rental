import { prisma } from "../../../lib/prisma.js";

const DEPOSIT_TETAP = 200000;

// =========================
// FORMAT RESPONS PESANAN
// =========================
function formatPesanan(data) {
  const transaksi = data.transaksi_harga;

  return {
    id: data.id_pesanan,
    id_pesanan: data.id_pesanan,

    user_id: data.id_users,
    id_users: data.id_users,

    id_motor: data.id_motor,

    nama: data.users.nama,
    telepon: data.users.telepon,

    motor: data.motor.nama_motor,
    nama_motor: data.motor.nama_motor,

    tanggal_mulai: data.tanggal_mulai,
    tanggal_selesai: data.tanggal_selesai,
    tanggal_kembali: data.tanggal_kembali,

    jumlah_hari: data.jumlah_hari,
    hari_terlambat: data.hari_terlambat,

    harga_per_hari:
      transaksi?.harga_sewa_snapshot.toString() || "0",

    persen_diskon: transaksi?.persen_diskon || 0,

    jumlah_diskon:
      transaksi?.jumlah_diskon.toString() || "0",

    denda: transaksi?.denda.toString() || "0",

    total_harga:
      transaksi?.total_biaya.toString() || "0",

    // STATUS PESANAN
    status: data.status_pesanan,
    status_pesanan: data.status_pesanan,

    // STATUS DEPOSIT
    jumlah_deposit: data.jumlah_deposit?.toString() || "0",
    status_deposit: data.status_deposit || "menunggu",
    catatan_deposit: data.catatan_deposit || null,
  };
}

// =========================
// INCLUDE RELASI
// =========================
const includePesanan = {
  users: true,
  motor: true,
  transaksi_harga: true,
};

// =========================
// GET - TAMPILKAN PESANAN
// =========================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    const data = await prisma.pesanan.findMany({
      where: userId
        ? {
            id_users: Number(userId),
          }
        : undefined,

      include: includePesanan,

      orderBy: {
        id_pesanan: "desc",
      },
    });

    return Response.json({
      success: true,
      pesanan: data.map(formatPesanan),
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

// =========================
// POST - TAMBAH PESANAN
// =========================
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      user_id,
      id_users,
      id_motor,
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

    const userId = Number(id_users || user_id);

    // CARI MOTOR BERDASARKAN ID ATAU NAMA
    let motorId = Number(id_motor);

    if (!motorId && motor) {
      const motorData = /^\d+$/.test(String(motor))
        ? await prisma.motor.findUnique({
            where: {
              id_motor: Number(motor),
            },
          })
        : await prisma.motor.findFirst({
            where: {
              nama_motor: String(motor),
            },
          });

      motorId = motorData?.id_motor;
    }

    if (
      !userId ||
      !motorId ||
      !tanggal_mulai ||
      !tanggal_selesai ||
      !tanggal_kembali
    ) {
      return Response.json(
        {
          success: false,
          message: "Data pesanan belum lengkap.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        id_users: userId,
      },
    });

    const motorData = await prisma.motor.findUnique({
      where: {
        id_motor: motorId,
      },
    });

    if (!user || !motorData) {
      return Response.json(
        {
          success: false,
          message: "User atau motor tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const harga = BigInt(
      harga_per_hari || motorData.harga_per_hari
    );

    const diskon = BigInt(jumlah_diskon || 0);
    const dendaValue = BigInt(denda || 0);

    const jumlahHari = Number(jumlah_hari);

    if (!Number.isInteger(jumlahHari) || jumlahHari < 1) {
      return Response.json(
        {
          success: false,
          message: "Jumlah hari tidak valid.",
        },
        { status: 400 }
      );
    }

    const total =
      total_harga !== undefined
        ? BigInt(total_harga)
        : harga * BigInt(jumlahHari) - diskon + dendaValue;

    // SIMPAN PESANAN
    const pesanan = await prisma.pesanan.create({
      data: {
        id_users: userId,
        id_motor: motorId,

        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        tanggal_kembali: new Date(tanggal_kembali),

        jumlah_hari: jumlahHari,
        hari_terlambat: Number(hari_terlambat) || 0,

        status_pesanan: "menunggu",

        // DATA DEPOSIT
        jumlah_deposit: BigInt(DEPOSIT_TETAP),
        status_deposit: "menunggu",
        catatan_deposit: null,

        transaksi_harga: {
          create: {
            harga_sewa_snapshot: harga,
            persen_diskon: Number(persen_diskon) || 0,
            jumlah_diskon: diskon,
            denda: dendaValue,
            total_biaya: total,
          },
        },
      },

      include: includePesanan,
    });

    return Response.json({
      success: true,
      message: "Penyewaan berhasil diajukan.",
      pesanan: formatPesanan(pesanan),
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

// =========================
// PUT - UPDATE PESANAN / DEPOSIT
// =========================
export async function PUT(request) {
  try {
    const body = await request.json();

    const {
      id,
      id_pesanan,
      status,
      status_pesanan,
      status_deposit,
      catatan_deposit,
    } = body;

    const pesananId = Number(id_pesanan || id);

    if (!Number.isInteger(pesananId) || pesananId <= 0) {
      return Response.json(
        {
          success: false,
          message: "ID pesanan tidak valid.",
        },
        { status: 400 }
      );
    }

    // =================================
    // UPDATE STATUS DEPOSIT
    // =================================
    if (status_deposit !== undefined) {
      const statusDepositBaru = status_deposit;

      const daftarStatusDeposit = [
        "menunggu",
        "diterima",
        "dikembalikan",
        "dipotong",
      ];

      if (!daftarStatusDeposit.includes(statusDepositBaru)) {
        return Response.json(
          {
            success: false,
            message: "Status deposit tidak valid.",
          },
          { status: 400 }
        );
      }

      const pesananLama = await prisma.pesanan.findUnique({
        where: {
          id_pesanan: pesananId,
        },
      });

      if (!pesananLama) {
        return Response.json(
          {
            success: false,
            message: "Pesanan tidak ditemukan.",
          },
          { status: 404 }
        );
      }

      // DEPOSIT HANYA DAPAT DITERIMA JIKA PESANAN DISETUJUI
      if (
        statusDepositBaru === "diterima" &&
        pesananLama.status_pesanan !== "disetujui"
      ) {
        return Response.json(
          {
            success: false,
            message: "Deposit hanya dapat diterima jika pesanan sudah disetujui.",
          },
          { status: 400 }
        );
      }

      // PENGEMBALIAN DAN PEMOTONGAN HARUS SETELAH DEPOSIT DITERIMA
      if (
        ["dikembalikan", "dipotong"].includes(statusDepositBaru) &&
        pesananLama.status_deposit !== "diterima"
      ) {
        return Response.json(
          {
            success: false,
            message: "Deposit harus diterima terlebih dahulu.",
          },
          { status: 400 }
        );
      }

      // ALASAN PEMOTONGAN WAJIB DIISI
      if (
        statusDepositBaru === "dipotong" &&
        !String(catatan_deposit || "").trim()
      ) {
        return Response.json(
          {
            success: false,
            message: "Alasan pemotongan deposit wajib diisi.",
          },
          { status: 400 }
        );
      }

      // UPDATE HANYA FIELD DEPOSIT
      const dataUpdate = {
        status_deposit: statusDepositBaru,
      };

      if (catatan_deposit !== undefined) {
        dataUpdate.catatan_deposit =
          String(catatan_deposit).trim() || null;
      }

      const pesanan = await prisma.pesanan.update({
        where: {
          id_pesanan: pesananId,
        },

        data: dataUpdate,

        include: includePesanan,
      });

      const pesan =
        statusDepositBaru === "diterima"
          ? "Deposit berhasil diterima."
          : statusDepositBaru === "dikembalikan"
          ? "Deposit berhasil dikembalikan."
          : statusDepositBaru === "dipotong"
          ? "Deposit berhasil ditandai sebagai dipotong."
          : "Status deposit berhasil diperbarui.";

      return Response.json({
        success: true,
        message: pesan,
        pesanan: formatPesanan(pesanan),
      });
    }

    // =================================
    // UPDATE STATUS PESANAN
    // =================================
    const statusBaru = status_pesanan || status;

    if (!["menunggu", "disetujui", "ditolak"].includes(statusBaru)) {
      return Response.json(
        {
          success: false,
          message: "Status pesanan tidak valid.",
        },
        { status: 400 }
      );
    }

    const pesanan = await prisma.pesanan.update({
      where: {
        id_pesanan: pesananId,
      },

      data: {
        status_pesanan: statusBaru,
      },

      include: includePesanan,
    });

    return Response.json({
      success: true,
      message:
        statusBaru === "disetujui"
          ? "Pesanan berhasil dikonfirmasi."
          : statusBaru === "ditolak"
          ? "Pesanan berhasil ditolak."
          : "Status pesanan berhasil diperbarui.",

      pesanan: formatPesanan(pesanan),
    });
  } catch (error) {
    console.error("PUT PESANAN ERROR:", error);

    return Response.json(
      {
        success: false,
        message:
          error.code === "P2025"
            ? "Pesanan tidak ditemukan."
            : "Gagal mengubah data pesanan.",
      },
      { status: error.code === "P2025" ? 404 : 500 }
    );
  }
}
