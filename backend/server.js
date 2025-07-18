const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "data.json");
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

// POST tambah mahasiswa
app.post("/mahasiswa", (req, res) => {
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

// PUT edit mahasiswa
app.put("/mahasiswa/:id", (req, res) => {
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
});

// DELETE mahasiswa
app.delete("/mahasiswa/:id", (req, res) => {
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
});

// --- WebSocket untuk komentar/log aktivitas ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let comments = [];

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

// POST login (pindahkan ke luar dari wss.on("connection"))
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = DUMMY_USER.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Email atau password salah" });
  }
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

// Contoh proteksi endpoint: hanya user login bisa akses daftar mahasiswa
app.get("/protected/mahasiswa", verifyToken, (req, res) => {
  try {
    const mahasiswa = readMahasiswa();
    res.json(mahasiswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint root agar tidak error 'Cannot GET /'
app.get("/", (req, res) => {
  res.send("Aplikasi Backend Mahasiswa berjalan!");
});

// Menjalankan server pada port yang ditentukan
server.listen(PORT, () => {
  // Menampilkan pesan bahwa API berjalan
  console.log(`Server berjalan di http://localhost:${PORT}/mahasiswa`);
});
