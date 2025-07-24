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
- **Log Aktivitas**: Komentar/log aktivitas via WebSocket dan logging ke file (Winston).
- **Edit & Hapus Data**: Dosen dapat mengedit dan menghapus data mahasiswa, mahasiswa hanya bisa edit data sendiri.
- **Log Aksi CRUD**: Semua aksi penting (login, edit, hapus, error) dicatat ke file log backend (`app.log`).
- **Monitoring & Keamanan**: Validasi input, proteksi endpoint, JWT, dan catatan keamanan tersedia.
- **Frontend Modern**: Tampilan Next.js terpisah untuk mahasiswa dan dosen, proteksi role di sisi frontend.
- **Komentar/Log Real-Time**: Fitur komentar/log aktivitas berbasis WebSocket di frontend.
- **Reset Log**: Log aktivitas dapat dihapus oleh dosen melalui endpoint khusus.

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

## Penjelasan Penggunaan Fitur

### 1. Login & Register

- Pengguna (mahasiswa/dosen) dapat mendaftar dan login menggunakan email dan password.
- Password disimpan secara aman menggunakan hash (bcrypt).
- Setelah login, pengguna mendapatkan token JWT yang digunakan untuk mengakses endpoint yang diproteksi.

### 2. Role-Based Access Control (RBAC)

- Setiap user memiliki role: `mahasiswa` atau `dosen`.
- Mahasiswa hanya dapat melihat dan mengedit biodata sendiri.
- Dosen dapat melihat, menambah, mengedit, dan menghapus semua data mahasiswa.
- Proteksi dilakukan di backend (middleware JWT & RBAC) dan frontend (navigasi & tampilan sesuai role).

### 3. Proteksi Halaman & Endpoint

- Semua endpoint penting di backend hanya bisa diakses jika sudah login (memiliki JWT valid).
- Frontend juga memproteksi halaman: user yang tidak sesuai role akan diarahkan ke halaman login atau halaman sesuai role.

### 4. Logging Aktivitas

- Aktivitas penting seperti login, akses data, dan error dicatat menggunakan Winston (log ke file `app.log` dan console).
- Terdapat fitur komentar/log real-time di frontend (WebSocket) untuk melihat aktivitas secara langsung.
- Log dapat dihapus melalui endpoint khusus (`DELETE /logs`).

### 5. Monitoring & Keamanan

- Praktik keamanan yang diterapkan:
  - **Security headers**: Backend menggunakan helmet, X-Frame-Options, dan X-Content-Type-Options untuk mencegah clickjacking dan sniffing.
  - **Validasi input/output**: Semua input penting (register, tambah/edit mahasiswa) divalidasi dan disanitasi untuk mencegah XSS.
  - **Proteksi endpoint**: Semua endpoint penting diproteksi JWT dan RBAC.
- Catatan dan evaluasi keamanan dapat dilihat di `backend/security-notes.txt`.
- Monitoring performa dan keamanan dapat dilakukan dengan PM2, Prometheus/Grafana, dsb. (lihat bagian Monitoring Sederhana di bawah).

---

### Monitoring Sederhana

Aplikasi dapat dipantau performanya menggunakan tool ringan seperti **PM2** atau integrasi Prometheus+Grafana.

**Contoh Monitoring dengan PM2:**

1. Install PM2: `npm install -g pm2`
2. Jalankan backend: `pm2 start server.js --name backend-mahasiswa`
3. Pantau performa: `pm2 monit` (lihat CPU, memori, request)
4. (Opsional) Lihat log: `pm2 logs backend-mahasiswa`

**Alternatif Prometheus+Grafana:**

- Integrasi dengan prom-client di backend untuk expose /metrics
- Tambahkan endpoint ke Prometheus, visualisasi di Grafana

Lampirkan screenshot dashboard monitoring di folder docs jika diperlukan.

---

## Dokumentasi Praktik Logging, Monitoring, dan Keamanan

### Ringkasan Logging

- Semua aktivitas penting (login, edit, hapus, error) dicatat menggunakan Winston ke file `backend/app.log` dan console.
- Contoh log:

  ```log
  2025-07-24T07:27:06.098Z [INFO] Edit data mahasiswa oleh dosen: dosen@email.com (id: 4)
  2025-07-24T07:29:47.459Z [INFO] Hapus data mahasiswa oleh dosen: dosen@email.com (id: 4, nama: Hilman)
  ```

- Logging dilakukan pada endpoint login, edit, hapus, dan akses data mahasiswa.
- Fitur komentar/log real-time juga tersedia di frontend (WebSocket) untuk aktivitas pengguna.

### Ringkasan Monitoring

- Monitoring performa backend dilakukan menggunakan **PM2** (atau bisa juga Prometheus+Grafana).
- Metrik yang dipantau: CPU usage, memory usage, dan request count.
- Jalankan `pm2 monit` untuk dashboard monitoring secara real-time.
- (Opsional) Lampirkan screenshot dashboard monitoring di folder `docs/`.

### Langkah-langkah Pengamanan & Potongan Kode

- **Security headers**: Menggunakan helmet, X-Frame-Options, dan X-Content-Type-Options.

  ```js
  const helmet = require("helmet");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  ```

- **Validasi input/output**: Semua input penting disanitasi untuk mencegah XSS.

  ```js
  function sanitizeInput(str) {
    if (typeof str !== "string") return str;
    return str.replace(/[<>]/g, "");
  }
  // Penggunaan pada endpoint register, tambah/edit mahasiswa
  nama = sanitizeInput(nama);
  email = sanitizeInput(email);
  jurusan = sanitizeInput(jurusan);
  ```

- **Proteksi endpoint**: Semua endpoint penting diproteksi JWT dan RBAC.

  ```js
  function verifyToken(req, res, next) {
    // ...
  }
  function authorizeRole(roles) {
    // ...
  }
  ```

- **Catatan keamanan**: Lihat file `backend/security-notes.txt` untuk evaluasi dan saran keamanan lebih lanjut.

### Tantangan & Pembelajaran

- **Tantangan**: Integrasi proteksi role di backend dan frontend agar benar-benar aman, serta memastikan logging tidak mengganggu performa aplikasi.
- **Pembelajaran**: Pentingnya validasi input, penggunaan security headers, dan logging aktivitas untuk audit dan troubleshooting. Monitoring performa sangat membantu mendeteksi bottleneck dan masalah aplikasi secara real-time.

---
