import { render, screen, fireEvent } from "@testing-library/react";
import Tambah from "@/app/tambah/page";

// Mock useRouter agar komponen Next.js yang menggunakan useRouter bisa dites
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Tambah Mahasiswa", () => {
  beforeEach(() => {
    // Simulasikan role dosen agar form bisa dirender
    window.localStorage.setItem("role", "dosen");
    window.localStorage.setItem("jwt_token", "dummy");
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it("render form tambah mahasiswa", () => {
    render(<Tambah />);
    // Cari input berdasarkan urutan (karena tidak ada placeholder)
    const inputs = screen.getAllByRole("textbox");
    expect(screen.getByText(/Tambah Mahasiswa Baru/i)).toBeInTheDocument();
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("button", { name: /Tambah/i })).toBeInTheDocument();
  });

  it("validasi field wajib", () => {
    render(<Tambah />);
    fireEvent.submit(
      screen.getByRole("button", { name: /Tambah/i }).closest("form")
    );
    // Perbaikan: gunakan getAllByText dan cek jumlah > 0
    const errors = screen.queryAllByText(/Semua field harus diisi/i);
    expect(errors.length).toBeGreaterThan(0);
  });
});
