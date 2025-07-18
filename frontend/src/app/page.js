import Link from "next/link";

export default function Home() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="container text-center">
        <h1 className="mb-4 text-primary">Aplikasi Daftar Mahasiswa</h1>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Link href="/login" className="btn btn-primary btn-lg">
            Lihat Daftar Mahasiswa
          </Link>
        </div>
        <p className="text-muted">
          @Copyright 2025 - Aplikasi ini Pembelajaran Rendi Sutendi
        </p>
      </div>
    </div>
  );
}
