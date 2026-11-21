import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "800"] });

export default function AuthShell({ judulKiri, children }) {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      {/* NAVIGASI */}
      <header className="flex h-24 items-center justify-between px-6 lg:px-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#087f6d]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="19" r="3" />
              <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
              <circle cx="18" cy="5" r="3" />
            </svg>
          </span>
          <span className="text-[30px] font-extrabold text-[#172f2c]">rettor</span>
        </Link>
        <Link href="/" className="text-sm font-semibold leading-[1.4] text-[#172f2c]">
          Kembali ke beranda
        </Link>
      </header>

      {/* AREA AUTENTIKASI */}
      <main className="flex flex-1 items-center justify-center px-6 pb-10 pt-6 lg:gap-12 lg:px-20 xl:gap-24">
        {/* kartu kiri: hanya tampil di layar lebar */}
        <aside className="hidden h-[792px] w-full max-w-[560px] flex-1 flex-col overflow-hidden rounded-3xl bg-[#f6f3ea] lg:flex">
          <div className="flex h-72 shrink-0 flex-col gap-4 px-10 py-9">
            <p className="text-[11px] font-semibold leading-[1.4] text-[#087f6d]">TEMAN JALANMU, DARI SINI.</p>
            <h2 className="text-[44px] font-normal leading-[1.1] text-[#172f2c]">
              {judulKiri[0]}
              <br />
              {judulKiri[1]}
            </h2>
            <p className="max-w-[440px] text-sm leading-[1.4] text-[#687773]">
              Sewa motor pilihan untuk agenda spontan, urusan harian, atau liburan. Pesan mudah, tinggal jalan.
            </p>
          </div>
          <div className="relative flex-1">
            <Image src="/login-hero.png" alt="" fill priority sizes="560px" className="object-cover" />
          </div>
        </aside>

        {/* kolom kanan: formulir */}
        <section className="flex w-full max-w-[464px] justify-center lg:max-w-[624px] lg:flex-1">
          <div className="w-full max-w-[464px]">{children}</div>
        </section>
      </main>

      {/* LEGAL */}
      <footer className="flex flex-col items-center justify-between gap-2 px-6 py-5 text-xs leading-[1.4] text-[#687773] sm:h-[72px] sm:flex-row sm:py-0 lg:px-20">
        <p>© 2026 Rettor. DKI Jakarta.</p>
        <div className="flex w-[260px] justify-between">
        </div>
      </footer>
    </div>
  );
}