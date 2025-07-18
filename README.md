# 📚 Aplikasi Daftar Mahasiswa

Aplikasi web sederhana untuk mengelola data mahasiswa menggunakan Node.js (Express) sebagai backend dan Next.js sebagai frontend.

---

## ✨ Fitur

- Tampilkan daftar mahasiswa
- Tambah mahasiswa baru
- Edit data mahasiswa
- Hapus mahasiswa
- Notifikasi status aksi (berhasil/gagal)
- Autentikasi login JWT
- Komentar/log aktivitas real-time (WebSocket)
- Proteksi halaman dengan JWT
- Logout
- Hapus log satu per satu dan semua log (permanen)
- Tampilan Bootstrap + FontAwesome
- Validasi input frontend & backend
- Evaluasi keamanan (lihat security-notes.txt)

---

## 📁 Struktur Folder

```
tugas26/
├── backend/            # Server Express & data JSON
│   ├── server.js       # Source utama backend
│   ├── data.json       # Data mahasiswa (JSON)
│   ├── comments.json   # Log/komentar aktivitas (JSON)
│   ├── package.json    # Dependency backend
│   └── security-notes.txt # Catatan keamanan
├── frontend/           # Next.js frontend
│   ├── src/app/        # Halaman utama (App Router)
│   ├── public/         # Asset publik
│   ├── package.json    # Dependency frontend
└── README.md           # Dokumentasi
```

---

## 🚀 Cara Menjalankan Aplikasi

1. Jalankan backend:
   ```bash
   cd tugas26/backend
   npm install
   node server.js
   ```
2. Jalankan frontend:
   ```bash
   cd tugas26/frontend
   npm install
   npm run dev
   ```
3. Buka browser dan akses `http://localhost:3000`

---

## 🔗 Cara Menggunakan API

- **GET** `/mahasiswa` — Ambil daftar mahasiswa
- **GET** `/mahasiswa/:id` — Ambil detail mahasiswa
- **POST** `/mahasiswa` — Tambah mahasiswa baru
- **PUT** `/mahasiswa/:id` — Edit data mahasiswa
- **DELETE** `/mahasiswa/:id` — Hapus mahasiswa
- **POST** `/login` — Login JWT
- **GET** `/protected/mahasiswa` — Daftar mahasiswa (proteksi JWT)
- **DELETE** `/logs` — Hapus semua log/komentar (permanen)

---

## 🔗 Cara Menggunakan API dengan Postman

1. Pastikan backend sudah berjalan di `http://localhost:3001`.
2. Buka aplikasi Postman.
3. Berikut contoh request yang bisa dicoba:

### Ambil daftar mahasiswa

- **GET** `http://localhost:3001/mahasiswa`

### Ambil detail mahasiswa

- **GET** `http://localhost:3001/mahasiswa/1`

### Tambah mahasiswa

- **POST** `http://localhost:3001/mahasiswa`
- Body (JSON):
  ```json
  {
    "nama": "Nama Baru",
    "email": "emailbaru@example.com",
    "jurusan": "Jurusan Baru"
  }
  ```

### Edit mahasiswa

- **PUT** `http://localhost:3001/mahasiswa/1`
- Body (JSON):
  ```json
  {
    "nama": "Nama Edit",
    "email": "emailedit@example.com",
    "jurusan": "Jurusan Edit"
  }
  ```

### Hapus mahasiswa

- **DELETE** `http://localhost:3001/mahasiswa/1`

### Login JWT

- **POST** `http://localhost:3001/login`
- Body (JSON):
  ```json
  {
    "email": "rendisutendi10@gmail.com",
    "password": "rendi123"
  }
  ```
- Response: token JWT

### Akses endpoint terproteksi

- **GET** `http://localhost:3001/protected/mahasiswa`
- Header: `Authorization: Bearer <token JWT dari login>`

### Hapus semua log/komentar

- **DELETE** `http://localhost:3001/logs`

---

## 📝 Catatan

- Data mahasiswa disimpan di file `backend/data.json`.
- Komentar/log real-time menggunakan WebSocket (port backend).
- Token JWT dikirim melalui header Authorization saat akses endpoint terproteksi.
- Untuk pengembangan, gunakan terminal terpisah untuk backend dan frontend.
- Fitur hapus log satu per satu dan semua log sudah sinkron dengan backend.
- Evaluasi keamanan ada di `backend/security-notes.txt`.

---

## 📦 Dependencies

- express
- cors
- ws
- jsonwebtoken
- next
- bootstrap
- @fortawesome/fontawesome-free

---

## 👨‍💻 Kontributor

- Rendi Sutendi
- Hilman Fatu

---

## 🏷️ Lisensi

MIT
