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
import KomentarRealtime from "../mahasiswa/KomentarRealtime";

export default function DosenPage() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [clientRole, setClientRole] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientRole(localStorage.getItem("role") || "");
      setClientName(localStorage.getItem("name") || "");
      if (localStorage.getItem("role") !== "dosen") {
        router.push("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (clientRole === "dosen") {
      fetch("http://localhost:3001/mahasiswa", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(
              errData.error || "Akses ditolak atau token tidak valid"
            );
          }
          return res.json();
        })
        .then((data) => {
          setMahasiswa(data);
          setLoading(false);
        })
        .catch((err) => {
          setStatus(err.message);
          setLoading(false);
        });
    } else {
      setStatus("Akses daftar mahasiswa hanya untuk dosen.");
      setMahasiswa([]);
      setLoading(false);
    }
  }, [clientRole, router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  const ws =
    typeof window !== "undefined"
      ? window.wsDosen ||
        (window.wsDosen = new WebSocket("ws://localhost:3001"))
      : null;

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
      <div className="mb-2">
        <strong>Login sebagai:</strong> {clientRole}{" "}
        {clientName && `(${clientName})`}
      </div>
      {status && <div className="alert alert-danger">{status}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "jwt_token"
                                )}`,
                              },
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
      )}
      <div className="d-flex gap-2 mb-4">
        <Link
          href="/tambah"
          className="btn btn-success d-flex align-items-center gap-1"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah Mahasiswa Baru
        </Link>
      </div>
      <KomentarRealtime />
    </div>
  );
}
