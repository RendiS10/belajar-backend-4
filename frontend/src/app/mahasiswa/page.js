"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faSignOutAlt,
  faUserGraduate,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import KomentarRealtime from "./KomentarRealtime";

export default function Mahasiswa() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  const ws =
    typeof window !== "undefined"
      ? window.wsMahasiswa ||
        (window.wsMahasiswa = new WebSocket("ws://localhost:3001"))
      : null;

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetch("http://localhost:3001/mahasiswa")
      .then((res) => res.json())
      .then((data) => setMahasiswa(data))
      .catch(() => setStatus("Gagal mengambil data"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;
    fetch("http://localhost:3001/protected/mahasiswa", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data mahasiswa");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4 bg-light p-4 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" /> Daftar
          Mahasiswa
        </h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
      {status && <div className="alert alert-danger">{status}</div>}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nama}</td>
              <td>{m.jurusan}</td>
              <td>
                <Link
                  href={`/edit/${m.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    if (
                      confirm(
                        `Yakin ingin menghapus data mahasiswa dengan ID ${m.id}?`
                      )
                    ) {
                      // Kirim log ke WebSocket sebelum proses hapus
                      if (ws && ws.readyState === 1) {
                        ws.send(
                          JSON.stringify({
                            type: "comment",
                            text: `Aksi: klik tombol hapus mahasiswa: ${m.nama}`,
                          })
                        );
                      }
                      try {
                        const res = await fetch(
                          `http://localhost:3001/mahasiswa/${m.id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (res.ok) {
                          alert("Data berhasil dihapus!");
                          setMahasiswa(
                            mahasiswa.filter((item) => item.id !== m.id)
                          );
                        } else {
                          alert("Gagal menghapus data!");
                        }
                      } catch {
                        alert("Gagal menghapus data!");
                      }
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} /> Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex gap-2 mb-4">
        <Link
          href="/tambah"
          className="btn btn-success d-flex align-items-center gap-1"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah Mahasiswa Baru
        </Link>
      </div>
      <div className="mb-4">
        <h2 className="fw-bold text-success">
          Daftar Mahasiswa (Proteksi JWT)
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul className="list-group">
            {Array.isArray(data) &&
              data.map((mhs) => (
                <li key={mhs.id} className="list-group-item">
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    className="me-2 text-primary"
                  />
                  {mhs.nama} - {mhs.email} - {mhs.jurusan}
                </li>
              ))}
          </ul>
        )}
      </div>
      <KomentarRealtime />
    </div>
  );
}
