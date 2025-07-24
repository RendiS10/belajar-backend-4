import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";

// Mock useRouter agar komponen Next.js yang menggunakan useRouter bisa dites
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("LoginPage", () => {
  it("render form login", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Login Mahasiswa/i)).toBeInTheDocument();
    // Cari input dengan placeholder karena label mengandung ikon SVG
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Login/i })[0]
    ).toBeInTheDocument();
  });

  it("validasi input email dan password", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getAllByRole("button", { name: /Login/i })[0]);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  });
});
