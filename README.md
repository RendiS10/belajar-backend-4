# Aplikasi Manajemen Mahasiswa

Aplikasi ini adalah sistem manajemen data mahasiswa berbasis web yang terdiri dari **backend (Express.js)** dan **frontend (Next.js)**. Fitur utama meliputi autentikasi, otorisasi berbasis peran (role), proteksi halaman, log aktivitas, dan dummy login Google OAuth.

---

## Fitur Utama

- **Login & Register**: Mahasiswa dan dosen dapat login/register. Password di-hash (bcrypt).
- **Role-Based Access Control (RBAC)**:
  - Mahasiswa hanya bisa melihat dan edit biodata sendiri.
  - Dosen bisa melihat, tambah, edit, dan hapus semua data mahasiswa.
- **Proteksi Halaman**: Semua halaman penting hanya bisa diakses setelah login dan sesuai role.
- **Dummy Google OAuth**: Tersedia tombol login Google (simulasi/mockup).
- **Log Aktivitas**: Komentar/log aktivitas via WebSocket.

---

## Cara Menjalankan Backend (Express.js)

1. Buka terminal dan masuk ke folder `backend`:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan server:
   ```sh
   node server.js
   ```
4. Server berjalan di `http://localhost:3001`

---

## Cara Menjalankan Frontend (Next.js)

1. Buka terminal dan masuk ke folder `frontend`:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan aplikasi:
   ```sh
   npm run dev
   ```
4. Frontend berjalan di `http://localhost:3000`

---

## Cara Login & Role

- **Mahasiswa**: Login dengan email dan password yang terdaftar.
- **Dosen**: Login dengan email dan password dosen, atau gunakan tombol "Login dengan Google (Mockup)" untuk simulasi login dosen.

---

## Penggunaan Aplikasi

1. **Login/Register** di halaman `/login`.
2. Setelah login:
   - Mahasiswa hanya bisa melihat dan edit biodata sendiri di `/mahasiswa`.
   - Dosen bisa melihat, tambah, edit, dan hapus semua data mahasiswa di `/dosen`.
3. Logout dengan tombol di pojok kanan atas.
4. Semua aksi penting akan tercatat di log (komentar realtime).

---

## Penggunaan Backend dengan Postman

### Register User

- **Method:** `POST`
- **URL:** `http://localhost:3001/register`
- **Body (JSON):**
  ```json
  {
    "email": "user@email.com",
    "password": "password123",
    "name": "Nama User",
    "role": "mahasiswa" // atau "dosen"
  }
  ```
- **Response:** Pesan sukses jika berhasil.

### Login User

- **Method:** `POST`
- **URL:** `http://localhost:3001/login`
- **Body (JSON):**
  ```json
  {
    "email": "user@email.com",
    "password": "password123"
  }
  ```
- **Response:** Token JWT, role, dan nama.

### Akses Data Mahasiswa

- **GET `/mahasiswa`**
  - **Header:** `Authorization: Bearer <token JWT dari login>`
  - Jika login sebagai dosen: dapat melihat semua data mahasiswa.
  - Jika login sebagai mahasiswa: hanya dapat melihat data sendiri.
- **POST `/mahasiswa`**
  - Hanya dosen yang bisa menambah data mahasiswa.
- **PUT `/mahasiswa/:id`**
  - Mahasiswa hanya bisa edit data sendiri, dosen bisa edit semua.
- **DELETE `/mahasiswa/:id`**
  - Hanya dosen yang bisa menghapus data mahasiswa.

### Endpoint Dosen

- **GET `/dosen/mahasiswa`**: Daftar semua mahasiswa (khusus dosen).
- **POST `/dosen/mahasiswa`**: Tambah mahasiswa (khusus dosen).
- **PUT `/dosen/mahasiswa/:id`**: Edit mahasiswa (khusus dosen).
- **DELETE `/dosen/mahasiswa/:id`**: Hapus mahasiswa (khusus dosen).

### Reset Log Aktivitas

- **Method:** `DELETE`
- **URL:** `http://localhost:3001/logs`

---

## Penting

- Selalu gunakan token JWT pada header Authorization untuk endpoint yang diproteksi.
- Data user tersimpan di `backend/users.json`.
- Data mahasiswa tersimpan di `backend/data.json`.
- Untuk reset log, gunakan endpoint DELETE `/logs` di backend.

---

Jika ada kendala atau pertanyaan, silakan hubungi pengembang.
