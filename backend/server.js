const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "data.json");
const COMMENTS_PATH = path.join(__dirname, "comments.json");
const USERS_PATH = path.join(__dirname, "users.json");
const SECRET_KEY = "jwt_secret_key_2025";

// Dummy user
const DUMMY_USER = [
  {
    email: "rendisutendi10@gmail.com",
    password: "rendi123",
    name: "Rendi Sutendi",
  },
  {
    email: "hilmanfatu@gmail.com",
    password: "hilman123",
    name: "Hilman Fatu",
  },
];

// Helper untuk baca data
function readMahasiswa() {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data);
}
// Helper untuk tulis data
function writeMahasiswa(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function readComments() {
  if (!fs.existsSync(COMMENTS_PATH)) return [];
  const data = fs.readFileSync(COMMENTS_PATH, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeComments(data) {
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(data, null, 2));
}

function readUsers() {
  if (!fs.existsSync(USERS_PATH)) return [];
  const data = fs.readFileSync(USERS_PATH, "utf-8");
  return JSON.parse(data);
}
function writeUsers(data) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));
}

// GET semua mahasiswa
app.get("/mahasiswa", (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    res.json(mahasiswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET detail mahasiswa
app.get("/mahasiswa/:id", (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    const mhs = mahasiswa.find((m) => m.id === parseInt(req.params.id));
    if (!mhs)
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    res.json(mhs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah mahasiswa: hanya dosen
app.post("/mahasiswa", verifyToken, authorizeRole(["dosen"]), (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    const { nama, email, jurusan } = req.body;
    if (!nama || !email || !jurusan)
      return res.status(400).json({ error: "Data tidak lengkap" });
    const id = mahasiswa.length ? mahasiswa[mahasiswa.length - 1].id + 1 : 1;
    const newMhs = { id, nama, email, jurusan };
    mahasiswa.push(newMhs);
    writeMahasiswa(mahasiswa);
    res.status(201).json(newMhs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit mahasiswa: mahasiswa hanya bisa edit data sendiri, dosen bisa edit semua
app.put("/mahasiswa/:id", verifyToken, (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    const idx = mahasiswa.findIndex((m) => m.id === parseInt(req.params.id));
    if (idx === -1)
      return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
    // Mahasiswa hanya bisa edit data sendiri
    if (
      req.user.role === "mahasiswa" &&
      mahasiswa[idx].email !== req.user.email
    ) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    const { nama, email, jurusan } = req.body;
    if (!nama || !email || !jurusan)
      return res.status(400).json({ error: "Data tidak lengkap" });
    mahasiswa[idx] = { id: mahasiswa[idx].id, nama, email, jurusan };
    writeMahasiswa(mahasiswa);
    res.json(mahasiswa[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE mahasiswa: hanya dosen
app.delete(
  "/mahasiswa/:id",
  verifyToken,
  authorizeRole(["dosen"]),
  (req, res) => {
    try {
      let mahasiswa = readMahasiswa();
      const idx = mahasiswa.findIndex((m) => m.id === parseInt(req.params.id));
      if (idx === -1)
        return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
      const deleted = mahasiswa[idx];
      mahasiswa.splice(idx, 1);
      writeMahasiswa(mahasiswa);
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// --- WebSocket untuk komentar/log aktivitas ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let comments = readComments();

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "init", comments }));
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === "comment" && data.text) {
        const comment = {
          text: data.text,
          time: new Date().toISOString(),
        };
        comments.push(comment);
        writeComments(comments);
        // Broadcast ke semua client
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "new", comment }));
          }
        });
      }
    } catch (e) {}
  });
});

// REGISTER endpoint
app.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }
  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: "Email sudah terdaftar" });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed, name, role });
  writeUsers(users);
  res.json({ message: "Register sukses" });
});

// LOGIN endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "User tidak ditemukan" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Password salah" });
  const token = jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    SECRET_KEY,
    { expiresIn: "2h" }
  );
  res.json({ token, role: user.role, name: user.name });
});

// Middleware verifikasi JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token diperlukan" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = user;
    next();
  });
}

// Middleware RBAC
function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    next();
  };
}

// GET /mahasiswa: dosen dapat semua data, mahasiswa hanya data sendiri
app.get("/mahasiswa", verifyToken, (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    if (req.user.role === "dosen") {
      // Dosen bisa lihat semua
      res.json(mahasiswa);
    } else if (req.user.role === "mahasiswa") {
      // Mahasiswa hanya bisa lihat data sendiri
      const mhs = mahasiswa.filter((m) => m.email === req.user.email);
      res.json(mhs);
    } else {
      res.status(403).json({ error: "Akses ditolak" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proteksi endpoint GET /mahasiswa agar hanya dosen yang bisa akses
app.get("/mahasiswa", verifyToken, authorizeRole(["dosen"]), (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    res.json(mahasiswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint dosen: daftar semua mahasiswa
app.get(
  "/dosen/mahasiswa",
  verifyToken,
  authorizeRole(["dosen"]),
  (req, res) => {
    try {
      const mahasiswa = readMahasiswa();
      res.json(mahasiswa);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Endpoint dosen: tambah mahasiswa
app.post(
  "/dosen/mahasiswa",
  verifyToken,
  authorizeRole(["dosen"]),
  (req, res) => {
    try {
      const mahasiswa = readMahasiswa();
      const { nama, email, jurusan } = req.body;
      if (!nama || !email || !jurusan)
        return res.status(400).json({ error: "Data tidak lengkap" });
      const id = mahasiswa.length ? mahasiswa[mahasiswa.length - 1].id + 1 : 1;
      const newMhs = { id, nama, email, jurusan };
      mahasiswa.push(newMhs);
      writeMahasiswa(mahasiswa);
      res.status(201).json(newMhs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Endpoint dosen: edit mahasiswa
app.put(
  "/dosen/mahasiswa/:id",
  verifyToken,
  authorizeRole(["dosen"]),
  (req, res) => {
    try {
      const mahasiswa = readMahasiswa();
      const idx = mahasiswa.findIndex((m) => m.id === parseInt(req.params.id));
      if (idx === -1)
        return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
      const { nama, email, jurusan } = req.body;
      if (!nama || !email || !jurusan)
        return res.status(400).json({ error: "Data tidak lengkap" });
      mahasiswa[idx] = { id: mahasiswa[idx].id, nama, email, jurusan };
      writeMahasiswa(mahasiswa);
      res.json(mahasiswa[idx]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Endpoint dosen: hapus mahasiswa
app.delete(
  "/dosen/mahasiswa/:id",
  verifyToken,
  authorizeRole(["dosen"]),
  (req, res) => {
    try {
      let mahasiswa = readMahasiswa();
      const idx = mahasiswa.findIndex((m) => m.id === parseInt(req.params.id));
      if (idx === -1)
        return res.status(404).json({ error: "Mahasiswa tidak ditemukan" });
      const deleted = mahasiswa[idx];
      mahasiswa.splice(idx, 1);
      writeMahasiswa(mahasiswa);
      res.json(deleted);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Endpoint root agar tidak error 'Cannot GET /'
app.get("/", (req, res) => {
  res.send("Aplikasi Backend Mahasiswa berjalan!");
});

// Endpoint hapus semua log
app.delete("/logs", (req, res) => {
  comments = [];
  writeComments(comments);
  // Broadcast ke semua client agar log dihapus
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "clear" }));
    }
  });
  res.json({ success: true });
});

// Menjalankan server pada port yang ditentukan
server.listen(PORT, () => {
  // Menampilkan pesan bahwa API berjalan
  console.log(`Server berjalan di http://localhost:${PORT}/mahasiswa`);
});
