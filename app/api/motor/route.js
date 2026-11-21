import { prisma } from "../../../lib/prisma.js";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

function formatMotor(data) {
  return {
    id: data.id_motor,
    id_motor: data.id_motor,
    nama: data.nama_motor,
    nama_motor: data.nama_motor,
    jenis: data.jenis,
    cc: data.cc,
    harga: data.harga_per_hari.toString(),
    harga_per_hari: data.harga_per_hari.toString(),
    gambar: data.gambar,
  };
}

async function simpanGambar(file) {
  if (!file || file.size === 0) return null;

  const tipeDiizinkan = ["image/jpeg", "image/png", "image/webp"];

  if (!tipeDiizinkan.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 2 MB.");
  }

  const folder = path.join(process.cwd(), "public", "uploads");

  const fs = await import("fs/promises");
  await fs.mkdir(folder, { recursive: true });

  const ekstensi = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  }[file.type];

  const namaFile = `${randomUUID()}${ekstensi}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(folder, namaFile), buffer);

  return `/uploads/${namaFile}`;
}

async function hapusGambar(gambar) {
  if (!gambar || !gambar.startsWith("/uploads/")) return;

  const namaFile = path.basename(gambar);
  const lokasi = path.join(process.cwd(), "public", "uploads", namaFile);

  try {
    await unlink(lokasi);
  } catch (error) {
    console.error("GAGAL HAPUS GAMBAR:", error);
  }
}

// GET
export async function GET() {
  try {
    const data = await prisma.motor.findMany({
      orderBy: { id_motor: "desc" },
    });

    return Response.json({
      success: true,
      motor: data.map(formatMotor),
    });
  } catch (error) {
    console.error("GET MOTOR ERROR:", error);

    return Response.json(
      { success: false, message: "Gagal mengambil data motor." },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  let gambarBaru = null;

  try {
    const formData = await request.formData();

    const nama = formData.get("nama");
    const jenis = formData.get("jenis");
    const cc = formData.get("cc");
    const harga = formData.get("harga");
    const file = formData.get("gambar");

    if (
      typeof nama !== "string" || !nama.trim() ||
      typeof jenis !== "string" || !jenis.trim() ||
      !cc || !harga ||
      !file || typeof file === "string"
    ) {
      return Response.json(
        { success: false, message: "Semua data motor dan foto wajib diisi." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(Number(cc)) || Number(cc) <= 0 ||
        !Number.isSafeInteger(Number(harga)) || Number(harga) <= 0) {
      return Response.json(
        { success: false, message: "CC dan harga harus berupa angka yang valid." },
        { status: 400 }
      );
    }

    gambarBaru = await simpanGambar(file);

    const motor = await prisma.motor.create({
      data: {
        nama_motor: nama.trim(),
        jenis,
        cc: Number(cc),
        harga_per_hari: BigInt(harga),
        gambar: gambarBaru,
      },
    });

    return Response.json({
      success: true,
      message: "Motor berhasil ditambahkan.",
      motor: formatMotor(motor),
    });
  } catch (error) {
    if (gambarBaru) await hapusGambar(gambarBaru);

    console.error("POST MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Gagal menambahkan motor.",
      },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(request) {
  let gambarBaru = null;

  try {
    const formData = await request.formData();

    const id = formData.get("id");
    const nama = formData.get("nama");
    const jenis = formData.get("jenis");
    const cc = formData.get("cc");
    const harga = formData.get("harga");
    const file = formData.get("gambar");

    if (!id || !nama || !jenis || !cc || !harga) {
      return Response.json(
        { success: false, message: "Data motor belum lengkap." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(Number(cc)) || Number(cc) <= 0 ||
        !Number.isSafeInteger(Number(harga)) || Number(harga) <= 0) {
      return Response.json(
        { success: false, message: "CC dan harga tidak valid." },
        { status: 400 }
      );
    }

    const motorLama = await prisma.motor.findUnique({
      where: { id_motor: Number(id) },
    });

    if (!motorLama) {
      return Response.json(
        { success: false, message: "Motor tidak ditemukan." },
        { status: 404 }
      );
    }

    if (file && typeof file !== "string" && file.size > 0) {
      gambarBaru = await simpanGambar(file);
    }

    const motor = await prisma.motor.update({
      where: { id_motor: Number(id) },
      data: {
        nama_motor: nama.trim(),
        jenis,
        cc: Number(cc),
        harga_per_hari: BigInt(harga),
        ...(gambarBaru ? { gambar: gambarBaru } : {}),
      },
    });

    if (gambarBaru && motorLama.gambar) {
      await hapusGambar(motorLama.gambar);
    }

    return Response.json({
      success: true,
      message: "Motor berhasil diperbarui.",
      motor: formatMotor(motor),
    });
  } catch (error) {
    if (gambarBaru) await hapusGambar(gambarBaru);

    console.error("PUT MOTOR ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Gagal memperbarui motor.",
      },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { success: false, message: "ID motor wajib diisi." },
        { status: 400 }
      );
    }

    const motor = await prisma.motor.findUnique({
      where: { id_motor: Number(id) },
    });

    if (!motor) {
      return Response.json(
        { success: false, message: "Motor tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.motor.delete({
      where: { id_motor: Number(id) },
    });

    await hapusGambar(motor.gambar);

    return Response.json({
      success: true,
      message: "Motor berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE MOTOR ERROR:", error);

    return Response.json(
      { success: false, message: "Gagal menghapus motor." },
      { status: 500 }
    );
  }
}
