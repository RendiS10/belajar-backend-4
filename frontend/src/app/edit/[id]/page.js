"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Link from "next/link";

export default function Edit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/mahasiswa/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data");
          return res.json();
        })
        .then((data) => {
          setNama(data.nama);
          setEmail(data.email);
          setJurusan(data.jurusan);
        })
        .catch(() => setStatus("Gagal mengambil data"));
    }
  }, [id]);

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : "";
    const userEmail =
      typeof window !== "undefined" ? localStorage.getItem("email") : "";
    if (role === "mahasiswa" && email && email !== userEmail) {
      setStatus("Akses ditolak: Anda hanya bisa edit data sendiri.");
      setTimeout(() => router.push("/mahasiswa"), 1500);
    }
  }, [email]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
  let ws;
  if (typeof window !== "undefined") {
    ws = window.wsEdit || null;
    if (!ws) {
      ws = new WebSocket("ws://localhost:3001");
      window.wsEdit = ws;
    }
  }
  const handleEdit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!nama || !email || !jurusan) {
      setStatus("Semua field harus diisi!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/mahasiswa/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama, email, jurusan }),
      });
      if (res.ok) {
        setStatus("Berhasil mengedit mahasiswa");
        if (ws && ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              type: "comment",
              text: `Mengedit mahasiswa: ${nama}`,
            })
          );
        }
        setTimeout(() => router.push("/mahasiswa"), 1000);
      } else {
        const data = await res.json();
        setStatus(data.error || "Gagal edit mahasiswa");
      }
    } catch {
      setStatus("Gagal terhubung ke server");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-warning">
        <FontAwesomeIcon icon={faEdit} /> Edit Mahasiswa
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
      <form onSubmit={handleEdit}>
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
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faSave} /> Simpan
        </button>
        <Link href="/mahasiswa" className="btn btn-secondary mt-3">
          Kembali
        </Link>
      </form>
    </div>
  );
}
