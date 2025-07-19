"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faLock,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", email);
        if (data.role === "dosen") {
          router.push("/dosen");
        } else {
          router.push("/mahasiswa");
        }
      } else {
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="p-4 shadow rounded bg-white"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <div className="text-center mb-3">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="3x"
            className="text-primary mb-2"
          />
          <h2 className="fw-bold mb-2">Login Mahasiswa</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="me-2 text-secondary"
              />{" "}
              Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FontAwesomeIcon icon={faLock} className="me-2 text-secondary" />{" "}
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
          <button
            type="button"
            className="btn btn-danger w-100 mt-2"
            onClick={() => {
              // Simulasi login Google: role dosen
              localStorage.setItem("jwt_token", "dummy_google_token");
              localStorage.setItem("role", "dosen");
              localStorage.setItem("name", "Google Dosen");
              localStorage.setItem("email", "google.dosen@dummy.com");
              router.push("/dosen");
            }}
          >
            Login dengan Google (Mockup)
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
