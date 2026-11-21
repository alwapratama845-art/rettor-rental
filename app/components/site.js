import Link from "next/link";
import { Inter } from "next/font/google";
import KeluarButton from "./KeluarButton";

// Ganti di sini kalau akun Instagram berubah. Dipakai otomatis di semua ikon Instagram.
export const INSTAGRAM_HANDLE = "@randydydy_";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ICONS = {
  route: (<><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>),
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
  "message-circle": <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  "calendar-days": (<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></>),
  "ticket-percent": (<><path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M9 9h.01" /><path d="m15 9-6 6" /><path d="M15 15h.01" /></>),
  "circle-check": (<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>),
  "arrow-right": (<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  "arrow-up-right": (<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>),
  "shield-check": (<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>),
  instagram: (<><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>),
  "arrow-left": (<><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>),
  "map-pin": (<><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>),
  "settings-2": (<><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></>),
  gauge: (<><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>),
  "contact-round": (<><path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" /></>),
  truck: (<><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>),
  "calendar-check": (<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></>),
  search: (<><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></>),
  camera: (<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>),
  pencil: (<><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>),
  "trash-2": (<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></>),
  plus: (<><path d="M5 12h14" /><path d="M12 5v14" /></>),
  bike: (<><circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="15" cy="5" r="1" /><path d="M12 17.5V14l-3-3 4-3 2 3h2" /></>),
  sparkles: (<><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></>),
  zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  star: <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />,
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>),
  "badge-check": (<><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></>),
  "key-round": (<><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></>),
};

export function Icon({ name, className = "size-4" }) {
  const svg = (cls) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );

  // Ikon Instagram otomatis diikuti nama akun (lihat INSTAGRAM_HANDLE di atas).
  if (name === "instagram") {
    const kelas = className.split(" ");
    const warna = kelas.filter((c) => c.startsWith("text-")).join(" ");
    const ukuran = kelas.filter((c) => !c.startsWith("text-")).join(" ");
    return (
      <span className={`inline-flex w-fit items-center gap-2 ${warna}`}>
        {svg(ukuran)}
        <span className="text-[13px] leading-none">{INSTAGRAM_HANDLE}</span>
      </span>
    );
  }

  return svg(className);
}

// `login` (true/false) menentukan tampilan navbar:
//   belum login -> Beranda · Pesanan · Profil + tombol "Masuk"
//   sudah login -> Beranda · Daftar Motor · Pesanan · Profil + tombol merah "Log out"
// Kalau `login` tidak diisi, dianggap sudah login bila `nama` ada.
// `aktif` menandai menu yang menyala hijau + titik: "beranda" | "motor" | "pesanan" | "profil".
export function SiteNav({ nama, admin = false, login, aktif = "beranda" }) {
  const masuk = login ?? Boolean(nama);
  const tautan = (id) =>
    `relative flex h-12 items-center font-medium ${aktif === id ? "text-[#087f6d]" : "text-[#172f2c]"}`;
  const titik = (id) =>
    !admin && aktif === id && (masuk || id === "motor") ? (
      <span className="absolute bottom-0 left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-[#087f6d]" />
    ) : null;

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-3 px-6 py-4 lg:h-24 lg:px-20 lg:py-0">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#087f6d] text-white">
          <Icon name="route" className="size-[22px]" />
        </span>
        <span className="text-[30px] font-extrabold tracking-[-1.5px] text-[#172f2c]">rettor</span>
      </Link>

      <nav className="order-3 flex w-full justify-center gap-8 text-sm md:order-none md:w-auto">
        <Link href="/" className={tautan("beranda")}>
          Beranda
          {titik("beranda")}
        </Link>
        {admin ? (
          <Link href="/admin" className={tautan("admin")}>Dashboard Admin</Link>
        ) : (
          <>
            {(masuk || aktif === "motor") && (
              <Link href="/motor" className={`${tautan("motor")} font-semibold`}>
                Daftar Motor
                {titik("motor")}
              </Link>
            )}
            <Link href="/pesanan" className={tautan("pesanan")}>
              Pesanan
              {titik("pesanan")}
            </Link>
            <Link href="/profil" className={tautan("profil")}>
              Profil
              {titik("profil")}
            </Link>
          </>
        )}
      </nav>

      {admin ? (
        <Link
          href="/admin"
          className="flex h-12 max-w-[160px] items-center rounded-lg border border-[#dee5df] bg-white px-[22px] text-sm font-semibold text-[#172f2c]"
        >
          <span className="truncate">{nama || "Masuk"}</span>
        </Link>
      ) : masuk ? (
        <KeluarButton />
      ) : (
        <Link
          href="/login"
          className="flex h-12 items-center rounded-lg border border-[#dee5df] bg-white px-[22px] text-sm font-semibold text-[#172f2c]"
        >
          Masuk
        </Link>
      )}
    </header>
  );
}

// `legal` menampilkan "Syarat & ketentuan" dan "Kebijakan privasi" di baris paling bawah.
export function SiteFooter({ legal = false }) {
  return (
    <footer className="flex flex-col gap-11 bg-[#103f37] px-6 pb-7 pt-14 lg:px-20">
      <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-11 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <p className="text-3xl font-semibold tracking-[-1.5px] text-white lg:text-[39px]">Kunci perjalananmu ada di sini.</p>
          <p className="text-[15px] text-[#e7f3ec]">Pilih motor, tentukan arah. Cerita berikutnya milikmu.</p>
        </div>
        <Link href="/motor" className="flex h-12 w-fit items-center gap-2.5 rounded-lg bg-[#d7eb95] px-[22px] text-sm font-semibold text-[#172f2c]">
          Temukan motormu
          <Icon name="arrow-up-right" className="size-[18px]" />
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-10 lg:flex-row">
        <div className="flex flex-col gap-[23px] lg:w-[340px]">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#d7eb95] text-[#103f37]">
              <Icon name="route" className="size-[22px]" />
            </span>
            <span className="text-[30px] font-extrabold tracking-[-1.5px] text-white">rettor</span>
          </div>
          <p className="text-[13px] leading-[1.75] text-[#e7f3ec]">
            Teman jalan andalan untuk sewa motor di Indonesia. Dari perjalanan harian sampai liburan yang sudah lama direncanakan.
          </p>
          <Icon name="instagram" className="size-[19px] text-[#e7f3ec]" />
        </div>

        <div className="flex flex-col gap-[18px] lg:w-[175px]">
          <p className="text-[13px] text-white">Layanan</p>
          <Link href="/motor" className="text-xs text-[#e7f3ec]">Rental Motor</Link>
          <Link href="/pesanan" className="text-xs text-[#e7f3ec]">Pesanan Online</Link>
          <span className="text-xs text-[#e7f3ec]">Promo rental</span>
          <span className="text-xs text-[#e7f3ec]">Konfirmasi Pesanan</span>
        </div>

        <div className="flex flex-col gap-[18px] lg:w-[236px]">
          <p className="text-[13px] text-white">Ada yang bisa dibantu?</p>
          <p className="flex items-center gap-2 text-xs text-[#e7f3ec]">
            <Icon name="message-circle" className="size-4 text-[#d7eb95]" />
            +62 852 1957 9928
          </p>
          <p className="text-xs text-[#e7f3ec]">randyrahmat04@gmail.com</p>
          <p className="text-[11px] text-[#e7f3ec]">Setiap hari</p>
          <div className="flex gap-2">
            {["BCA", "mandiri", "QRIS"].map((m) => (
              <span key={m} className="rounded bg-white px-[9px] py-[7px] text-[10px] font-bold text-[#103f37]">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-[11px] text-[#e7f3ec] sm:flex-row">
        <p>© 2026 Rettor. DKI Jakarta.</p>
        {legal && (
          <div className="flex gap-6">
            <span>Syarat &amp; ketentuan</span>
            <span>Kebijakan privasi</span>
          </div>
        )}
      </div>
    </footer>
  );
}

export function AdminShell({ tab, judul = "Kelola pesanan, tanpa kerumitan.", children }) {
  const tabCls = (aktif) =>
    `flex items-center rounded-t-xl px-6 py-[18px] text-sm font-semibold leading-[1.4] ${
      aktif ? "bg-white text-[#087f6d]" : "bg-[#f6f3ea] text-[#687773]"
    }`;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 lg:h-[100px] lg:px-20">
        <div className="flex items-center gap-[18px]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#087f6d] text-white">
              <Icon name="route" className="size-[22px]" />
            </span>
            <span className="text-[30px] font-extrabold text-[#172f2c]">rettor</span>
          </Link>
          <span className="rounded-lg bg-[#e7f3ec] px-2.5 py-1.5 text-sm font-semibold leading-[1.4] text-[#087f6d]">ADMIN</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden text-[13px] leading-[1.4] text-[#687773] sm:inline">Ruang pengelola</span>
          <Link href="/" className="rounded-lg border border-[#dee5df] bg-white px-5 py-[13px] text-sm font-semibold leading-[1.4] text-[#172f2c]">
            Lihat website ↗
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-[18px] bg-[#f6f3ea] px-6 pt-9 lg:px-20">
        <p className="text-xs font-bold leading-[1.4] tracking-[1.5px] text-[#087f6d]">RETTOR / ADMIN</p>
        <h1 className="text-3xl font-normal leading-[1.4] text-[#172f2c] lg:text-[40px]">{judul}</h1>
        <p className="text-[15px] leading-[1.4] text-[#687773]">Dashboard Admin RETTOR RENTAL</p>
        <div className="flex gap-2 pt-[14px]">
          <Link href="/admin" className={tabCls(tab === "pesanan")}>Kelola Pesanan</Link>
          <Link href="/admin/motor" className={tabCls(tab === "motor")}>Kelola Motor</Link>
        </div>
      </section>

      <main className="flex-1 bg-[#f8faf7] px-6 pb-14 pt-10 lg:px-20">{children}</main>

      <footer className="flex flex-col justify-between gap-2 bg-[#103f37] px-6 py-7 leading-[1.4] sm:flex-row lg:h-[100px] lg:px-20">
        <p className="whitespace-pre text-[13px] font-semibold text-white">{"rettor  /  Ruang pengelola"}</p>
        <p className="text-xs text-[#d0e4da]">Perjalanan baik dimulai dari pengelolaan yang rapi.</p>
      </footer>
    </div>
  );
}