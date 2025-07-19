"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSignOutAlt,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import KomentarRealtime from "./KomentarRealtime";

export default function Mahasiswa() {
  const [biodata, setBiodata] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [clientRole, setClientRole] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientRole(localStorage.getItem("role") || "");
      setClientName(localStorage.getItem("name") || "");
      setClientEmail(localStorage.getItem("email") || "");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (clientRole === "mahasiswa") {
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
          let mhs = null;
          if (Array.isArray(data)) {
            mhs = data.find((m) => m.email === clientEmail);
          }
          setBiodata(mhs);
          setLoading(false);
        })
        .catch((err) => {
          setStatus(err.message);
          setLoading(false);
        });
    } else {
      setStatus("Akses halaman ini hanya untuk mahasiswa.");
      setLoading(false);
    }
  }, [clientRole, clientEmail, router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  return (
    <div className="container mt-4 bg-light p-4 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold">
          <FontAwesomeIcon icon={faUserGraduate} className="me-2" /> Biodata
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
      {loading ? (
        <p>Loading...</p>
      ) : clientRole !== "mahasiswa" ? (
        <div className="alert alert-danger">
          Akses halaman ini hanya untuk mahasiswa.
        </div>
      ) : biodata ? (
        <table className="table table-bordered table-striped">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{biodata.id}</td>
            </tr>
            <tr>
              <th>Nama</th>
              <td>{biodata.nama}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{biodata.email}</td>
            </tr>
            <tr>
              <th>Jurusan</th>
              <td>{biodata.jurusan}</td>
            </tr>
            <tr>
              <th>Aksi</th>
              <td>
                <Link
                  href={`/edit/${biodata.id}`}
                  className="btn btn-warning btn-sm"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Biodata
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">
          Biodata Anda belum terdaftar di sistem. Silakan hubungi admin/dosen.
        </div>
      )}
      <KomentarRealtime />
    </div>
  );
}
