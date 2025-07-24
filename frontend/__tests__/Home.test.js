import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("menampilkan judul aplikasi", () => {
    render(<Home />);
    expect(screen.getByText(/Aplikasi Daftar Mahasiswa/i)).toBeInTheDocument();
  });
  it("menampilkan tombol login", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /Lihat Daftar Mahasiswa/i })
    ).toBeInTheDocument();
  });
});
