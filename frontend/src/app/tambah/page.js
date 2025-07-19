"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Tambah() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
  let ws;
  if (typeof window !== "undefined") {
    ws = window.wsTambah || null;
    if (!ws) {
      ws = new WebSocket("ws://localhost:3001");
      window.wsTambah = ws;
    }
  }

  // Proteksi akses hanya untuk dosen
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("role");
    if (role !== "dosen") {
      setTimeout(() => router.push("/mahasiswa"), 1000);
      return (
        <div className="container mt-4">
          <div className="alert alert-danger">Akses hanya untuk dosen!</div>
        </div>
      );
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!nama || !email || !jurusan) {
      setStatus("Semua field harus diisi!");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/mahasiswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama, email, jurusan }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Berhasil menambah mahasiswa");
        setNama("");
        setEmail("");
        setJurusan("");
        if (ws && ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              type: "comment",
              text: `Menambah mahasiswa: ${nama}`,
            })
          );
        }
        setTimeout(() => router.push("/mahasiswa"), 1000);
      } else {
        setStatus(data.error || "Gagal menambah mahasiswa");
      }
    } catch {
      setStatus("Gagal terhubung ke server");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-success">
        <FontAwesomeIcon icon={faPlus} /> Tambah Mahasiswa Baru
      </h2>
      {status && (
        <div
          className={`alert ${
            status.includes("Berhasil") ? "alert-success" : "alert-danger"
          }`}
        >
          {status}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            type="text"
            className="form-control"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Jurusan</label>
          <input
            type="text"
            className="form-control"
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
        {status && <div className="mt-3 alert alert-info">{status}</div>}
      </form>
      <Link href="/mahasiswa" className="btn btn-secondary mt-3">
        Kembali
      </Link>
    </div>
  );
}
