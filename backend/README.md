# Dokumentasi Pengujian Backend

## Tools

- **Mocha** & **Chai**: Framework dan assertion library untuk testing.
- **Supertest**: Untuk testing HTTP API Express.

## Cara Menjalankan Test

1. Pastikan server sudah berjalan di `http://localhost:3001`.
2. Jalankan perintah:
   ```
   npx mocha test.js
   ```

## Hasil Pengujian

### Fitur yang Diuji

- **Login** (POST /login)
- **Ambil data mahasiswa** (GET /mahasiswa)
- **Tambah mahasiswa** (POST /mahasiswa)
- **Edit mahasiswa** (PUT /mahasiswa/:id)
- **Hapus mahasiswa** (DELETE /mahasiswa/:id)

### Ringkasan Hasil

- **Login**: Berhasil login untuk user valid, gagal untuk password/user salah.
- **GET /mahasiswa**: Dosen dapat melihat semua data, mahasiswa hanya data sendiri.
- **POST /mahasiswa**: Hanya dosen yang bisa menambah mahasiswa.
- **PUT /mahasiswa/:id**: Mahasiswa hanya bisa edit data sendiri, dosen bisa edit semua.
- **DELETE /mahasiswa/:id**: Hanya dosen yang bisa menghapus mahasiswa.

### Perbaikan yang Dilakukan

- Menambah validasi role pada endpoint POST/PUT/DELETE mahasiswa.
- Menambah pengecekan data tidak lengkap pada endpoint mahasiswa.
- Menambah logging pada aksi penting (edit, hapus, akses data).

### Saran Pengembangan

- Tambahkan validasi email & password lebih ketat.
- Proteksi WebSocket dengan JWT.
- Implementasi rate limiting pada login.

---

Untuk detail pengujian, lihat file `test.js`.
