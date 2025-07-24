# Dokumentasi Pengujian Frontend

## Tools

- **Jest** untuk unit & integration testing
- **React Testing Library** untuk pengujian komponen React

## Hasil Pengujian

### 1. Home Page (`src/app/page.js`)

- **Status:** PASS
- Seluruh elemen utama (judul, tombol login) tampil sesuai harapan.

### 2. KomentarRealtime (`src/app/mahasiswa/KomentarRealtime.js`)

- **Status:** PASS
- Seluruh elemen utama (judul, input, tombol kirim) tampil sesuai harapan.

### 3. LoginPage (`src/app/login/page.js`) & Tambah (`src/app/tambah/page.js`)

- **Status:** GAGAL
- Error: `invariant expected app router to be mounted`.
- Penyebab: Komponen menggunakan `useRouter` dari `next/navigation` yang membutuhkan environment Next.js App Router.
- **Solusi:** Untuk pengujian unit/integrasi, gunakan mock/wrapper khusus untuk `useRouter` (misal: next-router-mock).

### 4. Tambah (`src/app/tambah/page.js`)

- **Status:** PASS
- Seluruh elemen form tampil dan validasi field wajib sudah teruji.
- Perbaikan assertion pada test validasi error: menggunakan `getAllByText` dan cek jumlah > 0 agar test lulus meski ada lebih dari satu pesan error yang sama.

## Coverage

- Home dan KomentarRealtime teruji, coverage lain rendah karena error pada komponen yang bergantung pada Next.js App Router.

## Perbaikan yang Dilakukan

- Konfigurasi Jest, Babel, dan alias path sudah benar.
- Perlu mock useRouter untuk pengujian lebih lanjut pada komponen yang menggunakan Next.js App Router.

## Saran

- Untuk pengujian lebih lanjut pada komponen Next.js berbasis App Router, gunakan mock pada `useRouter` atau library seperti `next-router-mock`.

---

_Dokumentasi ini dihasilkan otomatis dari hasil pengujian per 24 Juli 2025._
